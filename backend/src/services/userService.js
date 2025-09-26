const { supabaseAdmin } = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const { 
  formatUserResponse, 
  hashPassword, 
  comparePassword 
} = require('../utils/helpers');
const { 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  APPROVAL_STATUS 
} = require('../utils/constants');
const logger = require('../utils/logger');

const userService = {
  // Get user profile by ID
  getUserProfile: async (userId) => {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      return formatUserResponse(user);
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Get user profile error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updateData) => {
    try {
      const { name, bio, branch, phone, dateOfBirth } = updateData;

      // Verify user exists and is active
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id, email, approval_status')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (!existingUser) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      // Prepare update object (only include provided fields)
      const updateFields = {};
      if (name !== undefined) updateFields.name = name.trim();
      if (bio !== undefined) updateFields.bio = bio?.trim() || '';
      if (branch !== undefined) updateFields.branch = branch;
      if (phone !== undefined) updateFields.phone = phone?.trim() || null;
      if (dateOfBirth !== undefined) updateFields.date_of_birth = dateOfBirth;

      // Update user
      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update(updateFields)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Update user profile error:', error);
        throw new AppError('Failed to update profile', 500);
      }

      logger.info(`User profile updated: ${existingUser.email}`);
      return {
        user: formatUserResponse(updatedUser),
        message: SUCCESS_MESSAGES.PROFILE_UPDATED
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Update user service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Get user approval status
  getApprovalStatus: async (userId) => {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('approval_status, approved_at, rejection_reason')
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error || !user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      return {
        approvalStatus: user.approval_status,
        approvedAt: user.approved_at,
        rejectionReason: user.rejection_reason
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Get approval status error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Change user password
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      // Get current password hash
      const { data: credentials, error } = await supabaseAdmin
        .from('user_credentials')
        .select('password_hash, email')
        .eq('user_id', userId)
        .single();

      if (error || !credentials) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(
        currentPassword, 
        credentials.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      const { error: updateError } = await supabaseAdmin
        .from('user_credentials')
        .update({ password_hash: newPasswordHash })
        .eq('user_id', userId);

      if (updateError) {
        logger.error('Password update error:', updateError);
        throw new AppError('Failed to update password', 500);
      }

      logger.info(`Password changed for user: ${credentials.email}`);
      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Change password service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Get users by branch (for approved users)
  getUsersByBranch: async (branch, options = {}) => {
    try {
      const { page = 1, limit = 20, search = '' } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('users')
        .select('id, email, name, bio, branch, approved_at, created_at', { count: 'exact' })
        .eq('branch', branch)
        .eq('approval_status', APPROVAL_STATUS.APPROVED)
        .eq('is_active', true);

      // Add search functionality
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Add pagination
      query = query
        .range(offset, offset + limit - 1)
        .order('name', { ascending: true });

      const { data: users, error, count } = await query;

      if (error) {
        logger.error('Get users by branch error:', error);
        throw new AppError('Failed to fetch users', 500);
      }

      return {
        users: users.map(formatUserResponse),
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Get users by branch service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Deactivate user account
  deactivateAccount: async (userId) => {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .update({ is_active: false })
        .eq('id', userId)
        .select('email')
        .single();

      if (error || !user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      logger.info(`User account deactivated: ${user.email}`);
      return { message: 'Account deactivated successfully' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Deactivate account service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  }
};

module.exports = userService;

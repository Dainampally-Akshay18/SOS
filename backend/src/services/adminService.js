const { supabaseAdmin } = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const { 
  formatUserResponse, 
  formatAdminResponse,
  hashPassword 
} = require('../utils/helpers');
const { 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  APPROVAL_STATUS 
} = require('../utils/constants');
const logger = require('../utils/logger');

const adminService = {
  // Get all pending users with pagination
  getPendingUsers: async (options = {}) => {
    try {
      const { page = 1, limit = 20, search = '', branch = '' } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('users')
        .select('*', { count: 'exact' })
        .eq('approval_status', APPROVAL_STATUS.PENDING)
        .eq('is_active', true);

      // Add branch filter
      if (branch) {
        query = query.eq('branch', branch);
      }

      // Add search functionality
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Add pagination and sorting
      query = query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      const { data: users, error, count } = await query;

      if (error) {
        logger.error('Get pending users error:', error);
        throw new AppError('Failed to fetch pending users', 500);
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
      logger.error('Get pending users service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Get all users with filters
  getAllUsers: async (options = {}) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        search = '', 
        branch = '', 
        approvalStatus = '', 
        isActive = true 
      } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('users')
        .select('*', { count: 'exact' });

      // Add filters
      if (branch) query = query.eq('branch', branch);
      if (approvalStatus) query = query.eq('approval_status', approvalStatus);
      if (typeof isActive === 'boolean') query = query.eq('is_active', isActive);

      // Add search functionality
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      // Add pagination and sorting
      query = query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      const { data: users, error, count } = await query;

      if (error) {
        logger.error('Get all users error:', error);
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
      logger.error('Get all users service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Approve user
  approveUser: async (userId, adminId, adminNote = '') => {
    try {
      // Check if user exists and is pending
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      if (user.approval_status !== APPROVAL_STATUS.PENDING) {
        throw new AppError('User is not pending approval', 400);
      }

      // Approve user
      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update({
          approval_status: APPROVAL_STATUS.APPROVED,
          approved_by: adminId,
          approved_at: new Date().toISOString(),
          admin_note: adminNote,
          rejection_reason: null // Clear any previous rejection reason
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Approve user error:', error);
        throw new AppError('Failed to approve user', 500);
      }

      logger.info(`User approved: ${user.email} by admin: ${adminId}`);
      return {
        user: formatUserResponse(updatedUser),
        message: SUCCESS_MESSAGES.USER_APPROVED
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Approve user service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Reject user
  rejectUser: async (userId, adminId, rejectionReason, adminNote = '') => {
    try {
      // Check if user exists and is pending
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      if (user.approval_status !== APPROVAL_STATUS.PENDING) {
        throw new AppError('User is not pending approval', 400);
      }

      // Reject user
      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update({
          approval_status: APPROVAL_STATUS.REJECTED,
          approved_by: adminId,
          rejection_reason: rejectionReason,
          admin_note: adminNote,
          approved_at: null // Clear approval timestamp
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Reject user error:', error);
        throw new AppError('Failed to reject user', 500);
      }

      logger.info(`User rejected: ${user.email} by admin: ${adminId}, reason: ${rejectionReason}`);
      return {
        user: formatUserResponse(updatedUser),
        message: SUCCESS_MESSAGES.USER_REJECTED
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Reject user service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      // Get user statistics
      const { data: userStats, error: userStatsError } = await supabaseAdmin
        .from('users')
        .select('approval_status, branch, is_active')
        .eq('is_active', true);

      if (userStatsError) {
        logger.error('Get dashboard stats error:', userStatsError);
        throw new AppError('Failed to fetch statistics', 500);
      }

      // Calculate statistics
      const stats = {
        totalUsers: userStats.length,
        pendingUsers: userStats.filter(u => u.approval_status === APPROVAL_STATUS.PENDING).length,
        approvedUsers: userStats.filter(u => u.approval_status === APPROVAL_STATUS.APPROVED).length,
        rejectedUsers: userStats.filter(u => u.approval_status === APPROVAL_STATUS.REJECTED).length,
        branchStats: {
          'branch1(EZCC)': userStats.filter(u => u.branch === 'branch1(EZCC)').length,
          'branch2(NEZCC)': userStats.filter(u => u.branch === 'branch2(NEZCC)').length
        },
        recentRegistrations: null // Will be calculated separately
      };

      // Get recent registrations (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentUsers, error: recentUsersError } = await supabaseAdmin
        .from('users')
        .select('created_at')
        .eq('is_active', true)
        .gte('created_at', thirtyDaysAgo.toISOString());

      if (!recentUsersError) {
        stats.recentRegistrations = recentUsers.length;
      }

      return stats;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Get dashboard stats service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Create new admin/pastor
  createAdmin: async (adminData, creatorId) => {
    try {
      const { email, password, name, title, adminLevel, permissions } = adminData;

      // Check if admin already exists
      const { data: existingAdmin } = await supabaseAdmin
        .from('pastors')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      if (existingAdmin) {
        throw new AppError('Admin with this email already exists', 409);
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create admin
      const { data: newAdmin, error } = await supabaseAdmin
        .from('pastors')
        .insert([
          {
            email: email.toLowerCase(),
            password_hash: passwordHash,
            name: name.trim(),
            title,
            admin_level: adminLevel,
            permissions: permissions || {
              manageUsers: true,
              manageBothBranches: false,
              manageContent: false,
              manageSermons: false,
              createAdmins: false
            },
            created_by: creatorId,
            is_active: true
          }
        ])
        .select()
        .single();

      if (error) {
        logger.error('Create admin error:', error);
        throw new AppError('Failed to create admin', 500);
      }

      logger.info(`New admin created: ${email} by: ${creatorId}`);
      return {
        admin: formatAdminResponse(newAdmin),
        message: 'Admin created successfully'
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Create admin service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Toggle user active status
  toggleUserStatus: async (userId, adminId) => {
    try {
      const { data: user, error: fetchError } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError || !user) {
        throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
      }

      const newStatus = !user.is_active;

      const { data: updatedUser, error } = await supabaseAdmin
        .from('users')
        .update({ is_active: newStatus })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Toggle user status error:', error);
        throw new AppError('Failed to update user status', 500);
      }

      logger.info(`User status toggled: ${user.email} to ${newStatus ? 'active' : 'inactive'} by admin: ${adminId}`);
      return {
        user: formatUserResponse(updatedUser),
        message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Toggle user status service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  }
};

module.exports = adminService;

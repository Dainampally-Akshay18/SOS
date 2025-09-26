const userService = require('../services/userService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const userController = {
  // Get current user profile
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const user = await userService.getUserProfile(userId);

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      const result = await userService.updateUserProfile(userId, updateData);

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: { user: result.user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user approval status
  getApprovalStatus: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const approvalStatus = await userService.getApprovalStatus(userId);

      res.status(200).json({
        status: 'success',
        data: approvalStatus
      });
    } catch (error) {
      next(error);
    }
  },

  // Change password
  changePassword: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      const result = await userService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  },

  // Get users by branch (for approved users only)
  getUsersByBranch: async (req, res, next) => {
    try {
      const { branch } = req.params;
      const { page, limit, search } = req.query;

      const result = await userService.getUsersByBranch(branch, { page, limit, search });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Deactivate user account
  deactivateAccount: async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const result = await userService.deactivateAccount(userId);

      res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  },

  // Get user by ID (for admins)
  getUserById: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const user = await userService.getUserProfile(userId);

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;

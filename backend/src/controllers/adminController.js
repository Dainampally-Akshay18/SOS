const authService = require('../services/authService');
const adminService = require('../services/adminService');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const adminController = {
  // Admin login (already implemented)
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
      }

      const result = await authService.loginAdmin(email, password);

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          admin: result.admin,
          token: result.token
        }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get pending users
  getPendingUsers: async (req, res, next) => {
    try {
      const { page, limit, search, branch } = req.query;
      const result = await adminService.getPendingUsers({ page, limit, search, branch });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Get all users with filters
  getAllUsers: async (req, res, next) => {
    try {
      const { page, limit, search, branch, approvalStatus, isActive } = req.query;
      const result = await adminService.getAllUsers({ 
        page, 
        limit, 
        search, 
        branch, 
        approvalStatus, 
        isActive: isActive !== undefined ? isActive === 'true' : undefined
      });

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  // Approve user
  approveUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { adminNote } = req.body;
      const adminId = req.user.userId;

      const result = await adminService.approveUser(userId, adminId, adminNote);

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: { user: result.user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Reject user
  rejectUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { rejectionReason, adminNote } = req.body;
      const adminId = req.user.userId;

      if (!rejectionReason) {
        return next(new AppError('Rejection reason is required', 400));
      }

      const result = await adminService.rejectUser(userId, adminId, rejectionReason, adminNote);

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: { user: result.user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (req, res, next) => {
    try {
      const stats = await adminService.getDashboardStats();

      res.status(200).json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  },

  // Create new admin
  createAdmin: async (req, res, next) => {
    try {
      const adminData = req.body;
      const creatorId = req.user.userId;

      const result = await adminService.createAdmin(adminData, creatorId);

      res.status(201).json({
        status: 'success',
        message: result.message,
        data: { admin: result.admin }
      });
    } catch (error) {
      next(error);
    }
  },

  // Toggle user active status
  toggleUserStatus: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const adminId = req.user.userId;

      const result = await adminService.toggleUserStatus(userId, adminId);

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: { user: result.user }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;

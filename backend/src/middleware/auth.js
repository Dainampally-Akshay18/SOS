const authService = require('../services/authService');
const { supabaseAdmin } = require('../config/supabase');
const { AppError } = require('./errorHandler');
const logger = require('../utils/logger');

const authMiddleware = {
  // Require Authentication (for both users and admins)
  requireAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies.authToken;

      if (!token) {
        return next(new AppError('Access token required', 401));
      }

      // Verify token
      const decoded = authService.verifyToken(token);
      
      // Get fresh user data
      let userData;
      if (decoded.role === 'admin') {
        const { data } = await supabaseAdmin
          .from('pastors')
          .select('*')
          .eq('id', decoded.userId)
          .eq('is_active', true)
          .single();
        userData = data;
      } else {
        const { data } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', decoded.userId)
          .eq('is_active', true)
          .single();
        userData = data;
      }

      if (!userData) {
        return next(new AppError('User not found or inactive', 401));
      }

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        approvalStatus: decoded.approvalStatus,
        adminLevel: decoded.adminLevel,
        permissions: decoded.permissions,
        userData
      };

      next();
    } catch (error) {
      logger.error('Auth middleware error:', error);
      if (error instanceof AppError) {
        return next(error);
      }
      return next(new AppError('Authentication failed', 401));
    }
  },

  // Require Admin Role
  requireAdmin: (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (req.user.role !== 'admin') {
      return next(new AppError('Admin access required', 403));
    }

    next();
  },

  // Require User to be Approved
  requireApproval: (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (req.user.role === 'user' && req.user.approvalStatus !== 'approved') {
      return next(new AppError('Account pending approval', 403));
    }

    next();
  },

  // Check Specific Permission
  requirePermission: (permission) => {
    return (req, res, next) => {
      if (!req.user) {
        return next(new AppError('Authentication required', 401));
      }

      if (req.user.role !== 'admin') {
        return next(new AppError('Admin access required', 403));
      }

      if (!req.user.permissions?.[permission]) {
        return next(new AppError(`Permission '${permission}' required`, 403));
      }

      next();
    };
  },

  // Optional Auth (for public endpoints that benefit from user context)
  optionalAuth: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1] || req.cookies.authToken;

      if (token) {
        const decoded = authService.verifyToken(token);
        req.user = decoded;
      }
    } catch (error) {
      // Ignore auth errors for optional auth
      logger.debug('Optional auth failed:', error.message);
    }
    
    next();
  }
};

module.exports = authMiddleware;

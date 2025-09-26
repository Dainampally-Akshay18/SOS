const authService = require('../services/authService');
const { validateRequest, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

const authController = {
  // User Registration
  register: async (req, res, next) => {
    try {
      const { email, name, bio, branch, password } = req.body;

      // Additional validation
      if (!email || !name || !password) {
        return next(new AppError('Email, name, and password are required', 400));
      }

      if (password.length < 6) {
        return next(new AppError('Password must be at least 6 characters long', 400));
      }

      const result = await authService.registerUser({
        email,
        name,
        bio,
        branch,
        password
      });

      logger.info(`User registration successful: ${email}`);
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: {
          user: result.user
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // User Login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(new AppError('Email and password are required', 400));
      }

      const result = await authService.loginUser(email, password);

      // Set token in HTTP-only cookie (optional, for added security)
      res.cookie('authToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.status(200).json({
        status: 'success',
        message: result.message,
        data: {
          user: result.user,
          token: result.token
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // User Logout
  logout: async (req, res, next) => {
    try {
      // Clear the cookie
      res.clearCookie('authToken');
      
      logger.info(`User logged out: ${req.user?.email}`);
      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
      });

    } catch (error) {
      next(error);
    }
  },

  // Get current user info
  getProfile: async (req, res, next) => {
    try {
      // User info is available from auth middleware
      const user = req.user;

      res.status(200).json({
        status: 'success',
        data: {
          user
        }
      });

    } catch (error) {
      next(error);
    }
  },

  // Refresh token
  refreshToken: async (req, res, next) => {
    try {
      const { userId, role } = req.user;

      const result = await authService.refreshToken(userId, role);

      res.status(200).json({
        status: 'success',
        data: {
          token: result.token
        }
      });

    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;

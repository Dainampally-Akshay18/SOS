const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');
const { config } = require('../config/environment');
const { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  formatUserResponse,
  formatAdminResponse 
} = require('../utils/helpers');
const { 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES, 
  APPROVAL_STATUS 
} = require('../utils/constants');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

const authService = {
  // User Registration
  registerUser: async (userData) => {
    try {
      const { email, name, bio, branch, password } = userData;

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('email', email.toLowerCase())
        .single();

      if (existingUser) {
        throw new AppError(ERROR_MESSAGES.USER_EXISTS, 409);
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user in database
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert([
          {
            email: email.toLowerCase(),
            name: name.trim(),
            bio: bio?.trim() || '',
            branch,
            approval_status: APPROVAL_STATUS.PENDING,
            is_active: true,
            // Note: We store password hash in a separate auth table or use Supabase Auth
            // For now, we'll use a simple approach
          }
        ])
        .select()
        .single();

      if (error) {
        logger.error('User registration error:', error);
        throw new AppError('Registration failed', 500);
      }

      // Create corresponding auth record (simplified approach)
      await supabaseAdmin
        .from('user_credentials')
        .insert([
          {
            user_id: newUser.id,
            email: email.toLowerCase(),
            password_hash: passwordHash
          }
        ]);

      logger.info(`New user registered: ${email}`);
      return {
        user: formatUserResponse(newUser),
        message: SUCCESS_MESSAGES.USER_REGISTERED
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Registration service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // User Login
  loginUser: async (email, password) => {
    try {
      // Get user and credentials
      const { data: user } = await supabaseAdmin
        .from('users')
        .select(`
          *,
          user_credentials (
            password_hash
          )
        `)
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (!user || !user.user_credentials?.[0]) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Verify password
      const isValidPassword = await comparePassword(
        password, 
        user.user_credentials[0].password_hash
      );

      if (!isValidPassword) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Check approval status
      if (user.approval_status === APPROVAL_STATUS.REJECTED) {
        throw new AppError(ERROR_MESSAGES.ACCOUNT_REJECTED, 403);
      }

      // Generate JWT token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: 'user',
        approvalStatus: user.approval_status
      };

      const token = generateToken(tokenPayload);

      // Update last login
      await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      logger.info(`User logged in: ${email}`);
      return {
        user: formatUserResponse(user),
        token,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Login service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Admin Login
  loginAdmin: async (email, password) => {
    try {
      // Get pastor/admin data
      const { data: admin } = await supabaseAdmin
        .from('pastors')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('is_active', true)
        .single();

      if (!admin) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Verify password
      const isValidPassword = await comparePassword(password, admin.password_hash);

      if (!isValidPassword) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Generate JWT token with admin privileges
      const tokenPayload = {
        userId: admin.id,
        email: admin.email,
        role: 'admin',
        adminLevel: admin.admin_level,
        permissions: admin.permissions
      };

      const token = generateToken(tokenPayload);

      // Update last login
      await supabaseAdmin
        .from('pastors')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      logger.info(`Admin logged in: ${email}`);
      return {
        admin: formatAdminResponse(admin),
        token,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Admin login service error:', error);
      throw new AppError(ERROR_MESSAGES.SERVER_ERROR, 500);
    }
  },

  // Verify JWT Token
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      return decoded;
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      }
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token expired', 401);
      }
      throw new AppError('Token verification failed', 401);
    }
  },

  // Refresh Token
  refreshToken: async (userId, role) => {
    try {
      let user;
      if (role === 'admin') {
        const { data } = await supabaseAdmin
          .from('pastors')
          .select('*')
          .eq('id', userId)
          .eq('is_active', true)
          .single();
        user = data;
      } else {
        const { data } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', userId)
          .eq('is_active', true)
          .single();
        user = data;
      }

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const tokenPayload = role === 'admin' 
        ? {
            userId: user.id,
            email: user.email,
            role: 'admin',
            adminLevel: user.admin_level,
            permissions: user.permissions
          }
        : {
            userId: user.id,
            email: user.email,
            role: 'user',
            approvalStatus: user.approval_status
          };

      const newToken = generateToken(tokenPayload);
      return { token: newToken };

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Token refresh failed', 500);
    }
  }
};

module.exports = authService;

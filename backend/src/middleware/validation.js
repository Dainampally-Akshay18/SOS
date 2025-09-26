const Joi = require('joi');
const { AppError } = require('./errorHandler');

/**
 * Validation middleware factory function
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    // Validate the request body against the provided schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Include all errors, not just the first one
      stripUnknown: true, // Remove unknown fields from the validated data
      convert: true // Convert values to their specified types
    });

    if (error) {
      // Extract error messages from Joi error details
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '') // Remove quotes from error messages
      }));

      const errorMessage = errorMessages.map(err => `${err.field}: ${err.message}`).join(', ');
      
      return next(new AppError(`Validation error - ${errorMessage}`, 400));
    }

    // Replace request body with validated and sanitized data
    req.body = value;
    next();
  };
};

/**
 * Validation middleware for query parameters
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => 
        `${detail.path.join('.')}: ${detail.message.replace(/"/g, '')}`
      );
      
      return next(new AppError(`Query validation error - ${errorMessages.join(', ')}`, 400));
    }

    req.query = value;
    next();
  };
};

/**
 * Validation middleware for URL parameters
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => 
        `${detail.path.join('.')}: ${detail.message.replace(/"/g, '')}`
      );
      
      return next(new AppError(`Parameter validation error - ${errorMessages.join(', ')}`, 400));
    }

    req.params = value;
    next();
  };
};

// Custom validation patterns [web:205][web:208]
const patterns = {
  // Strong password pattern (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  // UUID pattern for validating IDs
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  // Phone number pattern (flexible format)
  phone: /^[\+]?[1-9][\d]{0,15}$/,
  // Channel name pattern for real-time subscriptions
  channel: /^[a-zA-Z0-9_-]+$/
};

// Validation schemas for different endpoints [web:211][web:212]
const schemas = {
  // User Registration Schema
  // In your userRegistration schema, update the dateOfBirth field:
userRegistration: Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .lowercase()
    .trim()
    .max(255)
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.max': 'Email cannot exceed 255 characters',
      'any.required': 'Email is required'
    }),
  
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
      'string.pattern.base': 'Name can only contain letters and spaces',
      'any.required': 'Name is required'
    }),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password cannot exceed 128 characters',
      'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
      'any.required': 'Password is required'
    }),
  
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required'
    }),
  
  bio: Joi.string()
    .max(500)
    .allow('', null)
    .optional()
    .trim()
    .messages({
      'string.max': 'Bio cannot exceed 500 characters'
    }),
  
  branch: Joi.string()
    .valid('branch1(EZCC)', 'branch2(NEZCC)')
    .required()
    .messages({
      'any.only': 'Branch must be either "branch1(EZCC)" or "branch2(NEZCC)"',
      'any.required': 'Branch selection is required'
    }),
  
  phone: Joi.string()
    .pattern(/^[\+]?[1-9][\d]{0,15}$/)
    .optional()
    .allow('', null)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  
  // FIXED: Make dateOfBirth truly optional and handle empty strings
  dateOfBirth: Joi.alternatives().try(
    Joi.date().max('now').messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    Joi.string().allow('', null),
    Joi.valid(null)
  ).optional()
}),


  // User Login Schema
  userLogin: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      }),
    
    rememberMe: Joi.boolean()
      .optional()
      .default(false)
  }),

  // Admin Login Schema
  adminLogin: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  }),

  // User Profile Update Schema
  userProfileUpdate: Joi.object({
    name: Joi.string()
      .min(2)
      .max(50)
      .optional()
      .trim()
      .pattern(/^[a-zA-Z\s]+$/)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'string.pattern.base': 'Name can only contain letters and spaces'
      }),
    
    bio: Joi.string()
      .max(500)
      .allow('', null)
      .optional()
      .trim()
      .messages({
        'string.max': 'Bio cannot exceed 500 characters'
      }),
    
    branch: Joi.string()
      .valid('branch1(EZCC)', 'branch2(NEZCC)')
      .optional()
      .messages({
        'any.only': 'Branch must be either "branch1(EZCC)" or "branch2(NEZCC)"'
      }),
    
    phone: Joi.string()
      .pattern(patterns.phone)
      .allow('', null)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid phone number'
      }),
    
    dateOfBirth: Joi.date()
      .max('now')
      .allow(null)
      .optional()
      .messages({
        'date.max': 'Date of birth cannot be in the future'
      })
  }),

  // User Approval/Rejection Schema
  userApproval: Joi.object({
    action: Joi.string()
      .valid('approve', 'reject')
      .optional()
      .messages({
        'any.only': 'Action must be either "approve" or "reject"'
      }),
    
    rejectionReason: Joi.when('action', {
      is: 'reject',
      then: Joi.string()
        .min(5)
        .max(200)
        .required()
        .trim()
        .messages({
          'string.min': 'Rejection reason must be at least 5 characters long',
          'string.max': 'Rejection reason cannot exceed 200 characters',
          'any.required': 'Rejection reason is required when rejecting a user'
        }),
      otherwise: Joi.string()
        .max(200)
        .optional()
        .trim()
        .messages({
          'string.max': 'Rejection reason cannot exceed 200 characters'
        })
    }),
    
    adminNote: Joi.string()
      .max(300)
      .optional()
      .trim()
      .messages({
        'string.max': 'Admin note cannot exceed 300 characters'
      })
  }),

  // Change Password Schema
  changePassword: Joi.object({
    currentPassword: Joi.string()
      .required()
      .messages({
        'any.required': 'Current password is required'
      }),
    
    newPassword: Joi.string()
      .min(8)
      .max(128)
      .required()
      .pattern(patterns.password)
      .invalid(Joi.ref('currentPassword'))
      .messages({
        'string.min': 'New password must be at least 8 characters long',
        'string.max': 'New password cannot exceed 128 characters',
        'string.pattern.base': 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
        'any.invalid': 'New password must be different from current password',
        'any.required': 'New password is required'
      }),
    
    confirmNewPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'New passwords do not match',
        'any.required': 'New password confirmation is required'
      })
  }),

  // Password Reset Request Schema
  forgotPassword: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      })
  }),

  // Password Reset Schema
  resetPassword: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'any.required': 'Reset token is required'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .required()
      .pattern(patterns.password)
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
        'any.required': 'Password is required'
      }),
    
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Password confirmation is required'
      })
  }),

  // Create Admin Schema
  createAdmin: Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .lowercase()
      .trim()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    
    password: Joi.string()
      .min(8)
      .max(128)
      .required()
      .pattern(patterns.password)
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password cannot exceed 128 characters',
        'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
        'any.required': 'Password is required'
      }),
    
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .trim()
      .pattern(/^[a-zA-Z\s]+$/)
      .messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'string.pattern.base': 'Name can only contain letters and spaces',
        'any.required': 'Name is required'
      }),
    
    title: Joi.string()
      .valid('Pastor', 'Associate Pastor', 'Admin')
      .required()
      .messages({
        'any.only': 'Title must be Pastor, Associate Pastor, or Admin',
        'any.required': 'Title is required'
      }),
    
    adminLevel: Joi.string()
      .valid('pastor', 'super_admin')
      .required()
      .messages({
        'any.only': 'Admin level must be pastor or super_admin',
        'any.required': 'Admin level is required'
      }),
    
    permissions: Joi.object({
      manageUsers: Joi.boolean().default(true),
      manageBothBranches: Joi.boolean().default(false),
      manageContent: Joi.boolean().default(false),
      manageSermons: Joi.boolean().default(false),
      createAdmins: Joi.boolean().default(false)
    }).optional()
  }),

  // **REAL-TIME VALIDATION SCHEMAS** [web:242][web:245]
  
  // Send Notification Schema
  sendNotification: Joi.object({
    recipientType: Joi.string()
      .valid('user', 'admin')
      .required()
      .messages({
        'any.only': 'Recipient type must be either "user" or "admin"',
        'any.required': 'Recipient type is required'
      }),
    
    recipientId: Joi.string()
      .pattern(patterns.uuid)
      .when('recipientType', {
        is: 'user',
        then: Joi.required(),
        otherwise: Joi.optional()
      })
      .messages({
        'string.pattern.base': 'Invalid recipient ID format',
        'any.required': 'Recipient ID is required for user notifications'
      }),
    
    message: Joi.string()
      .min(1)
      .max(500)
      .required()
      .trim()
      .messages({
        'string.min': 'Message cannot be empty',
        'string.max': 'Message cannot exceed 500 characters',
        'any.required': 'Message is required'
      }),
    
    notificationType: Joi.string()
      .valid('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'ANNOUNCEMENT', 'APPROVAL_STATUS_CHANGE', 'NEW_USER_REGISTRATION')
      .required()
      .messages({
        'any.only': 'Invalid notification type',
        'any.required': 'Notification type is required'
      }),
    
    priority: Joi.string()
      .valid('low', 'normal', 'high', 'urgent')
      .optional()
      .default('normal'),
    
    data: Joi.object().optional() // Additional data for the notification
  }),

  // Broadcast Message Schema
  broadcastMessage: Joi.object({
    message: Joi.string()
      .min(1)
      .max(1000)
      .required()
      .trim()
      .messages({
        'string.min': 'Message cannot be empty',
        'string.max': 'Message cannot exceed 1000 characters',
        'any.required': 'Message is required'
      }),
    
    targetAudience: Joi.string()
      .valid('all_admins', 'all_users', 'specific_branch', 'pending_users', 'approved_users')
      .required()
      .messages({
        'any.only': 'Invalid target audience',
        'any.required': 'Target audience is required'
      }),
    
    priority: Joi.string()
      .valid('low', 'normal', 'high', 'urgent')
      .optional()
      .default('normal'),
    
    branch: Joi.when('targetAudience', {
      is: 'specific_branch',
      then: Joi.string()
        .valid('branch1(EZCC)', 'branch2(NEZCC)')
        .required()
        .messages({
          'any.only': 'Branch must be either "branch1(EZCC)" or "branch2(NEZCC)"',
          'any.required': 'Branch is required for specific branch targeting'
        }),
      otherwise: Joi.optional()
    }),
    
    scheduleAt: Joi.date()
      .greater('now')
      .optional()
      .messages({
        'date.greater': 'Scheduled time must be in the future'
      }),
    
    expiresAt: Joi.date()
      .greater(Joi.ref('scheduleAt', { adjust: (value) => value || new Date() }))
      .optional()
      .messages({
        'date.greater': 'Expiration time must be after schedule time'
      })
  }),

  // Real-time Subscription Schema
  realtimeSubscription: Joi.object({
    channels: Joi.array()
      .items(Joi.string().pattern(patterns.channel))
      .min(1)
      .max(5)
      .required()
      .messages({
        'array.min': 'At least one channel is required',
        'array.max': 'Cannot subscribe to more than 5 channels at once',
        'string.pattern.base': 'Invalid channel name format',
        'any.required': 'Channels are required'
      }),
    
    userId: Joi.string()
      .pattern(patterns.uuid)
      .required()
      .messages({
        'string.pattern.base': 'Invalid user ID format',
        'any.required': 'User ID is required'
      })
  }),

  // Query parameter schemas [web:206][web:208]
  queryParams: {
    pagination: Joi.object({
      page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
          'number.min': 'Page number must be at least 1',
          'number.integer': 'Page number must be an integer'
        }),
      
      limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(20)
        .messages({
          'number.min': 'Limit must be at least 1',
          'number.max': 'Limit cannot exceed 100',
          'number.integer': 'Limit must be an integer'
        }),
      
      sort: Joi.string()
        .valid('name', 'email', 'created_at', '-name', '-email', '-created_at')
        .optional()
        .default('-created_at'),
      
      search: Joi.string()
        .min(1)
        .max(100)
        .optional()
        .trim()
        .messages({
          'string.min': 'Search term must be at least 1 character',
          'string.max': 'Search term cannot exceed 100 characters'
        })
    }),

    userFilter: Joi.object({
      branch: Joi.string()
        .valid('branch1(EZCC)', 'branch2(NEZCC)')
        .optional(),
      
      approvalStatus: Joi.string()
        .valid('pending', 'approved', 'rejected')
        .optional(),
      
      isActive: Joi.boolean()
        .optional()
    }),

    realtimeFilter: Joi.object({
      notificationType: Joi.string()
        .valid('INFO', 'WARNING', 'SUCCESS', 'ERROR', 'ANNOUNCEMENT', 'APPROVAL_STATUS_CHANGE', 'NEW_USER_REGISTRATION')
        .optional(),
      
      priority: Joi.string()
        .valid('low', 'normal', 'high', 'urgent')
        .optional(),
      
      fromDate: Joi.date()
        .optional(),
      
      toDate: Joi.date()
        .greater(Joi.ref('fromDate'))
        .optional()
        .messages({
          'date.greater': 'To date must be after from date'
        })
    })
  },

  // URL parameter schemas [web:261][web:264]
  urlParams: {
    userId: Joi.object({
      userId: Joi.string()
        .pattern(patterns.uuid)
        .required()
        .messages({
          'string.pattern.base': 'Invalid user ID format',
          'any.required': 'User ID is required'
        })
    }),

    adminId: Joi.object({
      adminId: Joi.string()
        .pattern(patterns.uuid)
        .required()
        .messages({
          'string.pattern.base': 'Invalid admin ID format',
          'any.required': 'Admin ID is required'
        })
    }),

    branch: Joi.object({
      branch: Joi.string()
        .valid('branch1(EZCC)', 'branch2(NEZCC)')
        .required()
        .messages({
          'any.only': 'Branch must be either "branch1(EZCC)" or "branch2(NEZCC)"',
          'any.required': 'Branch is required'
        })
    }),

    channel: Joi.object({
      channel: Joi.string()
        .pattern(patterns.channel)
        .valid('user-notifications', 'admin-notifications', 'general-notifications')
        .required()
        .messages({
          'string.pattern.base': 'Invalid channel name format',
          'any.only': 'Invalid channel type',
          'any.required': 'Channel is required'
        })
    }),

    notificationId: Joi.object({
      notificationId: Joi.string()
        .pattern(patterns.uuid)
        .required()
        .messages({
          'string.pattern.base': 'Invalid notification ID format',
          'any.required': 'Notification ID is required'
        })
    })
  }
};

module.exports = { 
  validateRequest, 
  validateQuery, 
  validateParams, 
  schemas,
  patterns 
};

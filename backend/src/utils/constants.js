const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  PASTOR: 'pastor',
  SUPER_ADMIN: 'super_admin'
};

const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const BRANCHES = {
  EZCC: 'branch1(EZCC)',
  NEZCC: 'branch2(NEZCC)'
};

const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Access denied. Invalid credentials.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Invalid input data provided.',
  SERVER_ERROR: 'Internal server error occurred.',
  USER_EXISTS: 'User with this email already exists.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_PENDING: 'Account is pending approval.',
  ACCOUNT_REJECTED: 'Account has been rejected.'
};

const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully. Please wait for admin approval.',
  LOGIN_SUCCESS: 'Login successful.',
  LOGOUT_SUCCESS: 'Logout successful.',
  USER_APPROVED: 'User approved successfully.',
  USER_REJECTED: 'User rejected successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.'
};

module.exports = {
  USER_ROLES,
  APPROVAL_STATUS,
  BRANCHES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};

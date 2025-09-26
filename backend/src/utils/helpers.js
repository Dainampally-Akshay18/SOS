const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { config } = require('../config/environment');

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.bcrypt.saltRounds);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (payload, expiresIn = config.jwt.expiresIn) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, config.jwt.secret);
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: '30d' });
};

// Format user response (remove sensitive data)
const formatUserResponse = (user) => {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Format admin response (remove sensitive data)
const formatAdminResponse = (admin) => {
  const { password_hash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword;
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate random string
const generateRandomString = (length = 32) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateRefreshToken,
  formatUserResponse,
  formatAdminResponse,
  isValidEmail,
  generateRandomString
};

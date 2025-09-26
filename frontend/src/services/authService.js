import apiClient, { getErrorMessage } from './api';

class AuthService {
  constructor() {
    this.baseURL = '/auth';
    this.adminURL = '/admin';
  }

  // User Registration
  // Update the register method to handle optional fields properly:
async register(userData) {
  try {
    // Clean up the data before sending
    const cleanData = {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword,
      bio: userData.bio || '',
      branch: userData.branch,
      phone: userData.phone || '',
      // Only send dateOfBirth if it's actually provided and valid
      ...(userData.dateOfBirth && userData.dateOfBirth.trim() && {
        dateOfBirth: userData.dateOfBirth
      })
    };

    const response = await apiClient.post(`${this.baseURL}/register`, cleanData);

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Registration successful'
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: getErrorMessage(error),
      details: error.response?.data?.details || null
    };
  }
}


  // User Login
  async login(email, password, rememberMe = false) {
    try {
      const response = await apiClient.post(`${this.baseURL}/login`, {
        email: email.toLowerCase().trim(),
        password,
        rememberMe
      });

      const { user, token } = response.data.data;

      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        ...user,
        role: 'user'
      }));

      // Set remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      return {
        success: true,
        user,
        token,
        message: response.data.message || 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Admin Login
  async adminLogin(email, password) {
    try {
      const response = await apiClient.post(`${this.adminURL}/login`, {
        email: email.toLowerCase().trim(),
        password
      });

      const { admin, token } = response.data.data;

      // Store authentication data
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        ...admin,
        role: 'admin'
      }));

      return {
        success: true,
        admin,
        token,
        message: response.data.message || 'Admin login successful'
      };
    } catch (error) {
      console.error('Admin login error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Logout
  async logout() {
    try {
      // Call logout endpoint (optional, for server-side cleanup)
      await apiClient.post(`${this.baseURL}/logout`);
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Clear stored authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get(`${this.baseURL}/profile`);
      
      const user = response.data.data.user;
      
      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, ...user };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        success: true,
        user
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      
      const updatedUser = response.data.data.user;
      
      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newUserData = { ...storedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));

      return {
        success: true,
        user: updatedUser,
        message: response.data.message || 'Profile updated successfully'
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post('/users/change-password', {
        currentPassword,
        newPassword,
        confirmNewPassword: newPassword
      });

      return {
        success: true,
        message: response.data.message || 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Get user approval status
  async getApprovalStatus() {
    try {
      const response = await apiClient.get('/users/approval-status');
      
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('Get approval status error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post(`${this.baseURL}/refresh-token`);
      
      const { token } = response.data.data;
      localStorage.setItem('authToken', token);

      return {
        success: true,
        token
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(`${this.baseURL}/forgot-password`, {
        email: email.toLowerCase().trim()
      });

      return {
        success: true,
        message: response.data.message || 'Password reset email sent'
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiClient.post(`${this.baseURL}/reset-password`, {
        token,
        password: newPassword,
        confirmPassword: newPassword
      });

      return {
        success: true,
        message: response.data.message || 'Password reset successful'
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: getErrorMessage(error)
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get stored user data
  getStoredUser() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return null;
    }
  }

  // Get stored token
  getStoredToken() {
    return localStorage.getItem('authToken');
  }

  // Validate token format (basic check)
  isValidTokenFormat(token) {
    if (!token) return false;
    
    // Basic JWT format check (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3;
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  approvalStatus: null,
  role: null,
  error: null
};

// Action types
const AuthActionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  UPDATE_APPROVAL_STATUS: 'UPDATE_APPROVAL_STATUS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        approvalStatus: action.payload.user?.approval_status,
        role: action.payload.role || 'user',
        isLoading: false,
        error: null
      };

    case AuthActionTypes.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        approvalStatus: null,
        role: null,
        isLoading: false,
        error: action.payload
      };

    case AuthActionTypes.LOGOUT:
      return {
        ...initialState,
        isLoading: false
      };

    case AuthActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AuthActionTypes.UPDATE_APPROVAL_STATUS:
      return {
        ...state,
        approvalStatus: action.payload,
        user: state.user ? { ...state.user, approval_status: action.payload } : null
      };

    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize authentication from stored token - FIXED: Use useCallback to prevent recreating
  const initializeAuth = useCallback(async () => {
    try {
      const token = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (token && storedUser && authService.isValidTokenFormat(token)) {
        // Verify token is still valid by fetching current user
        const result = await authService.getCurrentUser();
        
        if (result.success) {
          dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: {
              user: result.user,
              token,
              role: storedUser.role || 'user'
            }
          });
        } else {
          // Token is invalid, clear storage
          await authService.logout();
          dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        }
      } else {
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      await authService.logout(); // Clear invalid tokens
      dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
    }
  }, []); // Empty dependency array - this function doesn't depend on anything

  // FIXED: Initialize auth state on app load with proper dependency
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]); // Only depend on initializeAuth (which is memoized)

  // Login function - FIXED: Use useCallback to prevent recreating
  const login = useCallback(async (email, password, rememberMe = false) => {
    dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
    
    try {
      const result = await authService.login(email, password, rememberMe);
      
      if (result.success) {
        dispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: { 
            user: result.user, 
            token: result.token, 
            role: 'user' 
          }
        });
        return { success: true, user: result.user };
      } else {
        dispatch({
          type: AuthActionTypes.LOGIN_ERROR,
          payload: result.error
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      dispatch({
        type: AuthActionTypes.LOGIN_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []); // No dependencies needed

  // Register function - FIXED: Use useCallback
  const register = useCallback(async (userData) => {
    dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        return { 
          success: true, 
          user: result.data.user, 
          message: result.message 
        };
      } else {
        dispatch({
          type: AuthActionTypes.LOGIN_ERROR,
          payload: result.error
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      dispatch({
        type: AuthActionTypes.LOGIN_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []); // No dependencies needed

  // Admin login function - FIXED: Use useCallback
  const adminLogin = useCallback(async (email, password) => {
    dispatch({ type: AuthActionTypes.SET_LOADING, payload: true });
    
    try {
      const result = await authService.adminLogin(email, password);
      
      if (result.success) {
        dispatch({
          type: AuthActionTypes.LOGIN_SUCCESS,
          payload: { 
            user: result.admin, 
            token: result.token, 
            role: 'admin' 
          }
        });
        return { success: true, admin: result.admin };
      } else {
        dispatch({
          type: AuthActionTypes.LOGIN_ERROR,
          payload: result.error
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Admin login failed. Please try again.';
      dispatch({
        type: AuthActionTypes.LOGIN_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  }, []); // No dependencies needed

  // Logout function - FIXED: Use useCallback
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AuthActionTypes.LOGOUT });
    }
  }, []);

  // Update user profile - FIXED: Use useCallback and don't trigger re-render
  const updateUser = useCallback((userData) => {
    // Update context state only
    dispatch({
      type: AuthActionTypes.UPDATE_USER,
      payload: userData
    });
  }, []);

  // Update approval status - FIXED: Use useCallback
  const updateApprovalStatus = useCallback((status) => {
    dispatch({
      type: AuthActionTypes.UPDATE_APPROVAL_STATUS,
      payload: status
    });
  }, []);

  // Clear error - FIXED: Use useCallback
  const clearError = useCallback(() => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  }, []);

  // Helper functions - FIXED: Use useCallback and depend on state values
  const requiresApproval = useCallback(() => {
    return state.role === 'user' && state.approvalStatus === 'pending';
  }, [state.role, state.approvalStatus]);

  const isApproved = useCallback(() => {
    return state.role === 'admin' || state.approvalStatus === 'approved';
  }, [state.role, state.approvalStatus]);

  const isAdmin = useCallback(() => {
    return state.role === 'admin';
  }, [state.role]);

  // FIXED: Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => ({
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    approvalStatus: state.approvalStatus,
    role: state.role,
    error: state.error,
    
    // Actions
    login,
    register,
    adminLogin,
    logout,
    updateUser,
    updateApprovalStatus,
    clearError,
    
    // Helpers
    requiresApproval,
    isApproved,
    isAdmin,
    
    // Services
    authService
  }), [
    state.user,
    state.token,
    state.isAuthenticated,
    state.isLoading,
    state.approvalStatus,
    state.role,
    state.error,
    login,
    register,
    adminLogin,
    logout,
    updateUser,
    updateApprovalStatus,
    clearError,
    requiresApproval,
    isApproved,
    isAdmin
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

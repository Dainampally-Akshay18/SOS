import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import WaitingApproval from './components/dashboard/WaitingApproval';
import UserDashboard from './components/dashboard/UserDashboard';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isApproved, requiresApproval } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiresApproval()) {
    return <WaitingApproval />;
  }

  if (!isApproved()) {
    return <WaitingApproval />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, isApproved, requiresApproval } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    if (requiresApproval()) {
      return <Navigate to="/waiting" replace />;
    }
    if (isApproved()) {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/waiting" replace />;
  }

  return children;
};

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        } 
      />

      <Route 
        path="/waiting" 
        element={
          <ProtectedRoute>
            <WaitingApproval />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// MAIN APP COMPONENT - FIXED FOR FULL HEIGHT
function App() {
  return (
    <div className="h-full w-full">
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRealtimeNotifications } from '../../hooks/useRealtimeNotifications';
import Button from '../common/Button';

const WaitingApproval = () => {
  const { user, logout, updateApprovalStatus } = useAuth();
  const { notifications, connectionStatus } = useRealtimeNotifications(user?.id);
  const [approvalStatus, setApprovalStatus] = useState(user?.approval_status || 'pending');

  // Listen for real-time approval status changes
  useEffect(() => {
    const statusNotification = notifications.find(
      n => n.type === 'APPROVAL_STATUS_CHANGE' && n.data?.userId === user?.id
    );
    
    if (statusNotification) {
      setApprovalStatus(statusNotification.data.newStatus);
      updateApprovalStatus(statusNotification.data.newStatus);
    }
  }, [notifications, user?.id, updateApprovalStatus]);

  const handleLogout = async () => {
    await logout();
  };

  // If approved, redirect (handled by parent component)
  if (approvalStatus === 'approved') {
    return null;
  }

  // If rejected, show rejection message
  if (approvalStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Application Rejected
              </h2>
              <p className="text-gray-600 mb-4">
                Unfortunately, your application has been rejected by our church administrators.
              </p>
              
              {user?.rejection_reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-medium text-red-800 mb-2">Reason:</h3>
                  <p className="text-sm text-red-700">{user.rejection_reason}</p>
                </div>
              )}
              
              <p className="text-sm text-gray-500 mb-6">
                If you believe this was a mistake, please contact our church office directly.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.href = 'mailto:admin@church.com'}
              >
                Contact Church Office
              </Button>
              
              <Button
                variant="secondary"
                fullWidth
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default pending state
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Church Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-500">
                  {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="small"
                onClick={handleLogout}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
            {/* Animated waiting icon */}
            <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="h-10 w-10 text-purple-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Awaiting Approval
              </h2>
              <p className="text-gray-600 mb-6">
                Welcome, {user?.name}! Your application is currently being reviewed by our church administrators.
              </p>
            </div>

            {/* User Details */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Branch:</span>
                <span className="font-medium text-gray-900">{user?.branch || 'Not selected'}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Application Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <svg className="w-2 h-2 mr-1.5 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  Pending Review
                </span>
              </div>
            </div>

            {/* What happens next */}
            <div className="text-left space-y-3">
              <h3 className="font-medium text-gray-900">What happens next?</h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <svg className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  <span>A church administrator will review your application</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <svg className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  <span>You'll receive a real-time notification when approved</span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <svg className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx={4} cy={4} r={3} />
                  </svg>
                  <span>Once approved, you'll have full access to the church portal</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3 pt-4">
              <Button
                variant="outline"
                fullWidth
                onClick={() => window.location.reload()}
                icon={
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                }
              >
                Refresh Status
              </Button>
              
              <p className="text-xs text-gray-500">
                This page will automatically update when your status changes
              </p>
            </div>
          </div>

          {/* Live notifications */}
          {notifications.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx={4} cy={4} r={3} />
                </svg>
                Recent Updates
              </h4>
              
              <div className="space-y-2">
                {notifications.slice(0, 3).map((notification, index) => (
                  <div key={index} className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                    <div className="font-medium text-blue-900">{notification.message}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {new Date(notification.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WaitingApproval;

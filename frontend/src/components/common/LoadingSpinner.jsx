import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', fullScreen = true }) => {
  const containerClasses = fullScreen 
    ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Animated Church Icon */}
        <div className="relative mb-6">
          <div className="h-20 w-20 mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          {/* Rotating Ring */}
          <div className="absolute inset-0 h-20 w-20 mx-auto border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>

        {/* Loading Text */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h2>
        
        <p className="text-gray-600">
          Please wait a moment...
        </p>

        {/* Animated Dots */}
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;

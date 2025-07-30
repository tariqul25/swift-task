import React from 'react';

const Loading = ({ size = 'md', className = '' }) => {
  let sizeClasses = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-20 w-20' : 'h-12 w-12';

  return (
    <div className={`flex items-center min-h-screen justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 ${sizeClasses}`}
      />
    </div>
  );
};

export default Loading;

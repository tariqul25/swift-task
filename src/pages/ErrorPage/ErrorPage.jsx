import React from 'react';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">Error!</h1>
        <p className="text-3xl text-gray-600 mb-6">Page is not Available.</p>
        <a
          href="/"
          className="text-amber-600 hover:text-amber-900 underline text-lg"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;

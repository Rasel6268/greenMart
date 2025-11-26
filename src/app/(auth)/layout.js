import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center  px-4 sm:px-6 lg:px-8">
      <div className=" space-y-8">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
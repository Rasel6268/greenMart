
"use client";

import { useAuth } from '@/Hooks/useAuth';
import Link from 'next/link';

const UnauthorizedPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <svg 
              className="h-8 w-8 text-red-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
          
          {/* Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Unauthorized Access
          </h2>
          
          <div className="text-gray-600 mb-6 space-y-3">
            <p>
              You don't have permission to access the admin dashboard.
            </p>
            <p className="text-sm">
              {user ? (
                <>
                  Logged in as: <span className="font-semibold">{user.email}</span>
                  <br />
                  Your account doesn't have admin privileges.
                </>
              ) : (
                "Please log in with an admin account to continue."
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full inline-block border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md transition duration-200 font-semibold"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const ProtectedRoute = ({ children, fallbackPath = '/user/login' }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Store the intended destination for redirect after login
      const redirectPath = pathname !== '/user/login' ? pathname : '/dashboard';
      sessionStorage.setItem('redirectPath', redirectPath);
      
      router.push(`${fallbackPath}?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [user, loading, router, pathname, fallbackPath]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, render children
  if (user) {
    return children;
  }

  // If not authenticated, show nothing (will redirect)
  return null;
};

export default ProtectedRoute;
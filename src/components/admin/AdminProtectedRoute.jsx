// components/AdminProtectedRoute.jsx
"use client";

import { useAuth } from '@/Hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading, adminLoading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !adminLoading) {
      if (!user) {
        router.push('/admin/login');
        return;
      }
      if (!isAdmin) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, isAdmin, loading, adminLoading, router]);

  if (loading || adminLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Checking permissions...</span>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return children;
};


export default AdminProtectedRoute;
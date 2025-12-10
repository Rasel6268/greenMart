'use client'
import React, { useState } from 'react';
import { 
  UserIcon, 
  ShoppingBagIcon, 
  TruckIcon, 
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const UserLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { id: '/user/profile', label: 'Profile', icon: UserIcon },
    { id: '/user/orders', label: 'My Orders', icon: ShoppingBagIcon },
    { id: '/user/tracking', label: 'Order Tracking', icon: TruckIcon },
    { id: '/user/payments', label: 'My Payments', icon: CreditCardIcon },
  ];

  // Find active tab based on current pathname
  const activeTab = menuItems.find(item => pathname.startsWith(item.id))?.id || '/user/profile';

  return (
    <div className=" w-7/12 mx-auto min-h-screen bg-gray-50 shadow-md shadow-amber-500 my-5 rounded-2xl">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      <div className="flex">
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-30
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800">User Account</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your account</p>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.id;
                return (
                  <li key={item.id}>
                    <Link 
                      href={item.id}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Overlay for mobile when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-600 mt-2">
                Manage your {activeTab.toLowerCase().replace('/user/', '')} settings and preferences
              </p>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
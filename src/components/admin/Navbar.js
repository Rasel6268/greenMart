// components/layout/Header.js
"use client";

import { useAuth } from "@/Hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { set } from "react-hook-form";
import { toast } from "react-toastify";

export default function Header({ onMenuClick }) {
  const [adminProfile, setAdminProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const {userLogout} = useAuth()
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    userLogout()
     toast.success('Admin logout successfully')
     router.push('/login')
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            ☰
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100">
            🔔
          </button>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleProfileClick}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
              >
                <span className="text-sm font-medium text-white">AD</span>
              </button>

              {adminProfile && (
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">Admin User</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  👤 Profile Settings
                </button>
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
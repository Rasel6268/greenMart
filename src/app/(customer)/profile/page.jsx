"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyOrder from "@/components/user/dashboard/MyOrder";
import Payments from "@/components/user/dashboard/Payments";
import Profile from "@/components/user/dashboard/Profile";
import Tracking from "@/components/user/dashboard/Tracking";
import React, { useState } from "react";
import { 
  FaUser, 
  FaShoppingBag, 
  FaCreditCard, 
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronRight
} from "react-icons/fa";

const Dashboard = () => {
  const [active, setActive] = useState("profile");
  
  const menuItems = [
    { 
      name: "Profile", 
      href: "/profile", 
      icon: <FaUser className="text-lg" />, 
      case: "profile",
      description: "Manage your personal information"
    },
    { 
      name: "My Orders", 
      href: "/myorder", 
      icon: <FaShoppingBag className="text-lg" />, 
      case: "My_Order",
      description: "View your order history"
    },
    { 
      name: "Payments", 
      href: "/payments", 
      icon: <FaCreditCard className="text-lg" />, 
      case: "Payment",
      description: "Payment methods & history"
    },
    { 
      name: "Order Tracking", 
      href: "/tracking", 
      icon: <FaMapMarkerAlt className="text-lg" />, 
      case: "tracking",
      description: "Track your orders"
    },
  ];

  const renderContent = () => {
    switch (active) {
      case "profile":
        return <Profile />;
      case "My_Order":
        return <MyOrder />;
      case "Payment":
        return <Payments />;
      case "tracking":
        return <Tracking />;
      default:
        return <Profile />;
    }
  };

  return (
    <ProtectedRoute>
       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and view your orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden ">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 bg-gradient-to-b from-green-50 to-emerald-100 border-r border-gray-200 lg:block md:block hidden">
              {/* User Profile Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">JD</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800 text-lg">John Doe</h2>
                    <p className="text-gray-600 text-sm">john.doe@example.com</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Verified Account</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Navigation */}
              <div className="p-4">
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setActive(item.case)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${
                        active === item.case
                          ? 'bg-white shadow-lg border border-green-200 transform scale-105'
                          : 'hover:bg-white hover:shadow-md hover:border hover:border-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg transition-colors ${
                          active === item.case
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-600 group-hover:bg-green-100 group-hover:text-green-600'
                        }`}>
                          {item.icon}
                        </div>
                        <div className="text-left">
                          <div className={`font-semibold transition-colors ${
                            active === item.case ? 'text-green-600' : 'text-gray-700'
                          }`}>
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      <FaChevronRight className={`text-sm transition-transform ${
                        active === item.case ? 'text-green-500 rotate-90' : 'text-gray-400'
                      }`} />
                    </button>
                  ))}
                </nav>

                

                
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              <div className="h-full p-6 lg:p-8">
                {/* Content Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {menuItems.find(item => item.case === active)?.name || 'Profile'}
                    </h2>
                    <p className="text-gray-600 mt-1">
                      {menuItems.find(item => item.case === active)?.description || 'Manage your personal information'}
                    </p>
                  </div>
                </div>

                <div className="p-6 min-h-[400px]">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="grid grid-cols-4 gap-2">
            {menuItems.slice(0, 4).map((item, index) => (
              <button
                key={index}
                onClick={() => setActive(item.case)}
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                  active === item.case
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="text-lg">
                  {item.icon}
                </div>
                <span className="text-xs mt-1 font-medium">
                  {item.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
// components/dashboard/StatsCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({ title, value, change, trend, icon: Icon, color, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="ml-3">
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const formattedValue = typeof value === 'number' && value >= 1000 
    ? `$${(value / 1000).toFixed(1)}k`
    : value.toString().startsWith('$')
      ? value
      : value;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {formattedValue}
          </p>
          <div className={`flex items-center text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? (
              <ArrowUp size={14} className="mr-1" />
            ) : (
              <ArrowDown size={14} className="mr-1" />
            )}
            <span>{change}</span>
            <span className="text-gray-500 text-xs ml-2">from last month</span>
          </div>
        </div>
        <div className={`${color} p-3 sm:p-4 rounded-xl ml-3 transition-transform duration-300 hover:scale-110`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
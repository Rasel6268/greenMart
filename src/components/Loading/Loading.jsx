import React from 'react';

const ShoppingLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      {/* Animated Scene */}
      <div className="relative w-64 h-32 mb-6">
        {/* Road */}
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-gray-300"></div>
        <div className="absolute bottom-4 left-0 right-0 h-1 bg-yellow-200 border-dashed border-yellow-400 border-t"></div>
        
        {/* Shopping Cart (Destination) */}
        <div className="absolute right-4 bottom-6 text-green-500">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21m-7.5-2.5h9" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="18" cy="19" r="1" />
          </svg>
        </div>

        {/* Moving Delivery Truck */}
        <div className="absolute left-4 bottom-6 animate-move-truck">
          <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1" />
          </svg>
        </div>

        {/* Package in Truck */}
        <div className="absolute left-16 bottom-10 animate-bounce">
          <div className="w-6 h-4 bg-yellow-400 rounded flex items-center justify-center">
            <span className="text-xs">📦</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 font-semibold text-center animate-pulse">
        Delivery on the way to your cart!
      </p>
    </div>
  );
};
export default ShoppingLoading
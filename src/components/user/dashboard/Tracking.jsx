"use client";
import React, { useState } from "react";
import { 
  FaUser, 
  FaShoppingBag, 
  FaCreditCard, 
  FaMapMarkerAlt,
  FaCog,
  FaSignOutAlt,
  FaBell,
  FaChevronRight,
  FaStar,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaBoxOpen
} from "react-icons/fa";

// Demo Tracking Component with Search
const Tracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const allOrders = [
    {
      id: "#ORD-001",
      product: "iPhone 16 Pro Max",
      status: "delivered",
      steps: [
        { name: "Order Placed", status: "completed", date: "Jan 10, 10:30 AM" },
        { name: "Processing", status: "completed", date: "Jan 10, 2:15 PM" },
        { name: "Shipped", status: "completed", date: "Jan 11, 9:45 AM" },
        { name: "Out for Delivery", status: "completed", date: "Jan 12, 8:30 AM" },
        { name: "Delivered", status: "completed", date: "Jan 12, 2:15 PM" }
      ],
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456784",
      estimatedDelivery: "January 12, 2024",
      customer: "John Doe",
      orderDate: "2024-01-10",
      total: 1490
    },
    {
      id: "#ORD-002",
      product: "Wireless Earbuds Pro",
      status: "shipped",
      steps: [
        { name: "Order Placed", status: "completed", date: "Jan 12, 10:30 AM" },
        { name: "Processing", status: "completed", date: "Jan 12, 2:15 PM" },
        { name: "Shipped", status: "current", date: "Jan 13, 9:45 AM" },
        { name: "Out for Delivery", status: "pending", date: "Expected Jan 15" },
        { name: "Delivered", status: "pending", date: "" }
      ],
      carrier: "UPS",
      trackingNumber: "1Z999AA10123456785",
      estimatedDelivery: "January 15, 2024",
      customer: "John Doe",
      orderDate: "2024-01-12",
      total: 299
    },
    {
      id: "#ORD-003",
      product: "Smart Home Bundle",
      status: "processing",
      steps: [
        { name: "Order Placed", status: "completed", date: "Jan 14, 3:20 PM" },
        { name: "Processing", status: "current", date: "In progress" },
        { name: "Shipped", status: "pending", date: "" },
        { name: "Out for Delivery", status: "pending", date: "" },
        { name: "Delivered", status: "pending", date: "" }
      ],
      carrier: "FedEx",
      trackingNumber: "789012345678",
      estimatedDelivery: "January 18, 2024",
      customer: "John Doe",
      orderDate: "2024-01-14",
      total: 2250
    },
    {
      id: "#ORD-004",
      product: "Gaming Laptop",
      status: "out_for_delivery",
      steps: [
        { name: "Order Placed", status: "completed", date: "Jan 13, 11:15 AM" },
        { name: "Processing", status: "completed", date: "Jan 13, 4:30 PM" },
        { name: "Shipped", status: "completed", date: "Jan 14, 10:20 AM" },
        { name: "Out for Delivery", status: "current", date: "Today, 8:00 AM" },
        { name: "Delivered", status: "pending", date: "" }
      ],
      carrier: "DHL",
      trackingNumber: "123456789012",
      estimatedDelivery: "January 15, 2024",
      customer: "John Doe",
      orderDate: "2024-01-13",
      total: 1899
    },
    {
      id: "#ORD-005",
      product: "Smart Watch Series 8",
      status: "cancelled",
      steps: [
        { name: "Order Placed", status: "completed", date: "Jan 11, 9:45 AM" },
        { name: "Processing", status: "completed", date: "Jan 11, 1:20 PM" },
        { name: "Cancelled", status: "cancelled", date: "Jan 12, 10:15 AM" }
      ],
      carrier: "USPS",
      trackingNumber: "9200199999999999999999",
      estimatedDelivery: "Cancelled",
      customer: "John Doe",
      orderDate: "2024-01-11",
      total: 450
    }
  ];

  const searchOrders = (query) => {
    setIsSearching(true);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const results = allOrders.filter(order => 
      order.id.toLowerCase().includes(query.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(query.toLowerCase()) ||
      order.product.toLowerCase().includes(query.toLowerCase()) ||
      order.carrier.toLowerCase().includes(query.toLowerCase())
    );

    // Simulate API delay
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 800);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchOrders(searchQuery);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "current": return "text-blue-600 bg-blue-100";
      case "pending": return "text-gray-400 bg-gray-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-400 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return FaCheckCircle;
      case "current": return FaClock;
      case "pending": return FaTimesCircle;
      case "cancelled": return FaTimesCircle;
      default: return FaTimesCircle;
    }
  };

  const getOverallStatus = (order) => {
    switch (order.status) {
      case "delivered": return { text: "Delivered", color: "text-green-600 bg-green-100" };
      case "shipped": return { text: "Shipped", color: "text-blue-600 bg-blue-100" };
      case "processing": return { text: "Processing", color: "text-orange-600 bg-orange-100" };
      case "out_for_delivery": return { text: "Out for Delivery", color: "text-purple-600 bg-purple-100" };
      case "cancelled": return { text: "Cancelled", color: "text-red-600 bg-red-100" };
      default: return { text: "Processing", color: "text-gray-600 bg-gray-100" };
    }
  };

  const displayOrders = searchQuery ? searchResults : [];

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Track Your Order</h3>
        <p className="text-gray-600 mb-6">Enter your order ID, tracking number, or product name to track your package</p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID, Tracking Number, or Product Name..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center gap-2"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch />
                  Search
                </>
              )}
            </button>
          </div>
          
          {searchQuery && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {isSearching ? "Searching..." : `Found ${searchResults.length} order(s) for "${searchQuery}"`}
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-red-500 hover:text-red-600 font-medium"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Results Section */}
      {isSearching ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Searching Orders</h3>
          <p className="text-gray-600">Looking for orders matching your search...</p>
        </div>
      ) : displayOrders.length === 0 && searchQuery ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h3>
          <p className="text-gray-600 mb-4">We couldn't find any orders matching "{searchQuery}"</p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• Check if the order ID or tracking number is correct</p>
            <p>• Try searching by product name</p>
            <p>• Ensure you're using the correct format</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search Summary */}
          {searchQuery && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800">Search Results</h4>
                  <p className="text-blue-700 text-sm">
                    Showing {searchResults.length} order(s) for "{searchQuery}"
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Show All Orders
                </button>
              </div>
            </div>
          )}

          {/* Orders List */}
          {displayOrders.map((order, orderIndex) => {
            const overallStatus = getOverallStatus(order);
            const StatusIcon = getStatusIcon(order.status);
            
            return (
              <div key={orderIndex} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <FaShoppingBag className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{order.id}</div>
                      <div className="text-gray-600">{order.product}</div>
                      <div className="text-sm text-gray-500">Ordered on {order.orderDate}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="text-sm space-y-1">
                      <div className="text-gray-500">Total Amount</div>
                      <div className="font-bold text-gray-800">${order.total}</div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${overallStatus.color}`}>
                      <StatusIcon className="text-sm" />
                      {overallStatus.text}
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Carrier</div>
                    <div className="font-semibold text-gray-800">{order.carrier}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Tracking Number</div>
                    <div className="font-semibold text-gray-800">{order.trackingNumber}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Est. Delivery</div>
                    <div className="font-semibold text-green-600">{order.estimatedDelivery}</div>
                  </div>
                </div>

                {/* Tracking Steps */}
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {order.steps.map((step, stepIndex) => {
                      const StepIcon = getStatusIcon(step.status);
                      return (
                        <div key={stepIndex} className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                            step.status === "completed" ? "bg-green-500 text-white" :
                            step.status === "current" ? "bg-blue-500 text-white" :
                            step.status === "cancelled" ? "bg-red-500 text-white" :
                            "bg-gray-200 text-gray-400"
                          }`}>
                            <StepIcon className="text-sm" />
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className={`font-semibold ${
                                  step.status === "completed" ? "text-green-600" :
                                  step.status === "current" ? "text-blue-600" :
                                  step.status === "cancelled" ? "text-red-600" :
                                  "text-gray-400"
                                }`}>
                                  {step.name}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{step.date}</div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
                                {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Support Card */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <FaMapMarkerAlt className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">Need Help with Delivery?</h4>
            <p className="text-gray-600">Our support team is here to help with any delivery issues or questions about your order.</p>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

// Rest of the dashboard components remain the same as previous implementation
// ... (Profile, MyOrder, Payments components and main Dashboard component)

export default Tracking;
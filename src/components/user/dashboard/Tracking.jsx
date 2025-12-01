"use client";
import { useAuth } from "@/Hooks/useAuth";
import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { 
  FaShoppingBag, 
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from "react-icons/fa";

// Helper function to generate tracking steps based on order status
const generateTrackingSteps = (order) => {
  if (!order) return [];
  
  const baseSteps = [
    { 
      name: "Order Placed", 
      status: "completed", 
      date: new Date(order.createdAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
      }) 
    },
    { 
      name: "Payment Confirmed", 
      status: order.payment?.status === "success" ? "completed" : "pending", 
      date: order.payment?.status === "success" ? "Confirmed" : "Pending" 
    },
    { name: "Processing", status: "pending", date: "" },
    { name: "Shipped", status: "pending", date: "" },
    { name: "Out for Delivery", status: "pending", date: "" },
    { name: "Delivered", status: "pending", date: "" }
  ];

  switch (order.orderStatus) {
    case "pending":
      baseSteps[2].status = "current";
      baseSteps[2].date = "In progress";
      break;
    case "confirmed":
      baseSteps[1].status = "completed";
      baseSteps[2].status = "current";
      baseSteps[2].date = "In progress";
      break;
    case "processing":
      baseSteps[2].status = "completed";
      baseSteps[3].status = "current";
      baseSteps[3].date = "In progress";
      break;
    case "shipped":
      baseSteps[2].status = "completed";
      baseSteps[3].status = "completed";
      baseSteps[4].status = "current";
      baseSteps[4].date = "In progress";
      break;
    case "out_for_delivery":
      baseSteps[2].status = "completed";
      baseSteps[3].status = "completed";
      baseSteps[4].status = "completed";
      baseSteps[5].status = "current";
      baseSteps[5].date = "Today";
      break;
    case "delivered":
      baseSteps[1].status = "completed";
      baseSteps[2].status = "completed";
      baseSteps[3].status = "completed";
      baseSteps[4].status = "completed";
      baseSteps[5].status = "completed";
      baseSteps[5].date = new Date(order.updatedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric' 
      });
      break;
    case "cancelled":
      return [
        { 
          name: "Order Placed", 
          status: "completed", 
          date: new Date(order.createdAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
          }) 
        },
        { 
          name: "Cancelled", 
          status: "cancelled", 
          date: new Date(order.updatedAt).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric' 
          }) 
        }
      ];
    default:
      return baseSteps;
  }

  return baseSteps;
};

// Helper to get estimated delivery date
const getEstimatedDelivery = (order) => {
  if (!order?.createdAt) return "Not available";
  
  const orderDate = new Date(order.createdAt);
  const deliveryDays = order.shipping?.estimated_delivery || "1-2";
  const maxDays = parseInt(deliveryDays.split('-').pop()) || 2;
  
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(orderDate.getDate() + maxDays);
  
  return deliveryDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const Tracking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: async () => {
      const res = await instance.get(`/orders/my_order?email=${user.email}`);
      return res?.data?.my_order || [];
    },
    enabled: !!user?.email
  });

  // Ensure ordersData is always an array
  const allOrders = Array.isArray(ordersData) ? ordersData : [];

  const searchOrders = (query) => {
    setIsSearching(true);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const results = allOrders.filter(order => {
      if (!order) return false;
      
      const searchableText = [
        order.orderId,
        order.tran_id,
        order._id,
        order.customer?.name,
        order.customer?.email,
        ...(order.products?.map(product => product.name) || [])
      ].filter(Boolean).join(' ').toLowerCase();

      return searchableText.includes(query.toLowerCase());
    });

    // Simulate API delay
    setTimeout(() => {
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchOrders(searchQuery);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Real-time search as user types
    if (value.trim()) {
      searchOrders(value);
    } else {
      setSearchResults([]);
    }
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
      case "pending": return FaClock;
      case "cancelled": return FaTimesCircle;
      default: return FaClock;
    }
  };

  const getOverallStatus = (order) => {
    if (!order) return { text: "Unknown", color: "text-gray-600 bg-gray-100" };
    
    switch (order.orderStatus) {
      case "delivered": return { text: "Delivered", color: "text-green-600 bg-green-100" };
      case "confirmed": return { text: "Confirmed", color: "text-blue-600 bg-blue-100" };
      case "processing": return { text: "Processing", color: "text-orange-600 bg-orange-100" };
      case "out_for_delivery": return { text: "Out for Delivery", color: "text-purple-600 bg-purple-100" };
      case "cancelled": return { text: "Cancelled", color: "text-red-600 bg-red-100" };
      default: return { text: "Pending", color: "text-gray-600 bg-gray-100" };
    }
  };

  const displayOrders = searchQuery ? searchResults : "";

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Orders</h3>
        <p className="text-gray-600">Fetching your order information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <FaTimesCircle className="text-6xl text-red-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600">Unable to load your orders. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Track Your Order</h3>
        <p className="text-gray-600 mb-6">
          Enter your Order ID (e.g., ORD1764349203591R31M7Z), Transaction ID, or product name to track your package
        </p>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Enter Order ID (ORD...), Transaction ID, or Product Name..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
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
                  Track Order
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

        {/* Search Tips */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800 mb-2">Search Tips:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Use your Order ID: <code className="bg-blue-100 px-1 rounded">ORD1764349203591R31M7Z</code></p>
            <p>• Use Transaction ID: <code className="bg-blue-100 px-1 rounded">TXN1764349203591TL5XHTMOE</code></p>
            <p>• Search by product name: "iPhone 16 Pro Max"</p>
            <p>• Or search by your name: "Hyatt Harrell"</p>
          </div>
        </div>
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
      ) : displayOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <FaBoxOpen className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {searchQuery ? "No Orders Found" : "No Orders Yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `We couldn't find any orders matching "${searchQuery}"`
              : "You haven't placed any orders yet."
            }
          </p>
          {searchQuery && (
            <div className="space-y-2 text-sm text-gray-500 max-w-md mx-auto">
              <p className="font-semibold">Please check:</p>
              <p>• Is the Order ID correct? (e.g., ORD1764349203591R31M7Z)</p>
              <p>• Try using the Transaction ID instead</p>
              <p>• Search by product name or your name</p>
              <p>• Ensure you're logged in with the correct account</p>
            </div>
          )}
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
          {displayOrders.map((order) => {
            if (!order) return null;
            
            const overallStatus = getOverallStatus(order);
            const StatusIcon = getStatusIcon(order.orderStatus);
            const trackingSteps = generateTrackingSteps(order);
            const estimatedDelivery = getEstimatedDelivery(order);
            
            return (
              <div key={order._id || order.orderId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <FaShoppingBag className="text-white text-lg" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{order.orderId}</div>
                      <div className="text-gray-600">
                        {order.products?.length || 0} item{order.products?.length > 1 ? 's' : ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="text-sm space-y-1">
                      <div className="text-gray-500">Total Amount</div>
                      <div className="font-bold text-gray-800">${order.payment?.amount?.total || 0}</div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${overallStatus.color}`}>
                      <StatusIcon className="text-sm" />
                      {overallStatus.text}
                    </div>
                  </div>
                </div>

                {/* Order Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
                    <div className="font-semibold text-gray-800 text-xs">{order.tran_id}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Payment Status</div>
                    <div className={`font-semibold ${
                      order.payment?.status === "success" ? "text-green-600" : 
                      order.payment?.status === "pending" ? "text-orange-600" : "text-red-600"
                    }`}>
                      {order.payment?.status ? order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1) : "Pending"}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Est. Delivery</div>
                    <div className="font-semibold text-green-600 text-sm">{estimatedDelivery}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Shipping Area</div>
                    <div className="font-semibold text-gray-800 flex items-center justify-center gap-1 text-sm">
                      <FaMapMarkerAlt className="text-red-500" />
                      {order.shipping?.upozila}, {order.shipping?.district}
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-3">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      <span className="text-gray-700">{order.customer?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-blue-500" />
                      <span className="text-gray-700">{order.customer?.phone}</span>
                    </div>
                    <div className="md:col-span-2 flex items-start gap-2">
                      <FaMapMarkerAlt className="text-blue-500 mt-1" />
                      <span className="text-gray-700">
                        {order.customer?.address?.street}, {order.customer?.address?.apartment && `${order.customer.address.apartment}, `}
                        {order.customer?.address?.city}, {order.customer?.address?.district} - {order.customer?.address?.upozila}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tracking Steps */}
                <div className="relative mb-6">
                  <h4 className="font-semibold text-gray-800 mb-4">Order Tracking</h4>
                  <div className="absolute left-4 top-10 bottom-4 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {trackingSteps.map((step, stepIndex) => {
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

                {/* Products Summary */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {order.products?.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                            }}
                          />
                          <div>
                            <div className="font-medium text-gray-800">{product.name}</div>
                            <div className="text-gray-500 text-sm">Qty: {product.quantity} × ${product.price}</div>
                          </div>
                        </div>
                        <div className="text-gray-800 font-medium">
                          ${(product.price * product.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {/* Order Summary */}
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        Subtotal: ${order.payment?.amount?.subtotal}<br />
                        Discount: -${order.payment?.amount?.discount}<br />
                        Shipping: ${order.payment?.amount?.shipping}
                      </div>
                      <div className="text-lg font-bold text-gray-800">
                        Total: ${order.payment?.amount?.total}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Tracking;
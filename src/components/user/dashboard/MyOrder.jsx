import React from 'react';
import { 
  FaShoppingBag, 
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from "react-icons/fa";
const MyOrder = () => {
  const orders = [
    {
      id: "#ORD-001",
      date: "2024-01-15",
      items: 3,
      total: 1490,
      status: "Delivered",
      statusColor: "text-green-600 bg-green-100",
      icon: FaCheckCircle
    },
    {
      id: "#ORD-002",
      date: "2024-01-12",
      items: 1,
      total: 299,
      status: "Processing",
      statusColor: "text-blue-600 bg-blue-100",
      icon: FaClock
    },
    {
      id: "#ORD-003",
      date: "2024-01-10",
      items: 5,
      total: 2250,
      status: "Shipped",
      statusColor: "text-orange-600 bg-orange-100",
      icon: FaTruck
    },
    {
      id: "#ORD-004",
      date: "2024-01-08",
      items: 2,
      total: 598,
      status: "Cancelled",
      statusColor: "text-red-600 bg-red-100",
      icon: FaTimesCircle
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Order History</h3>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            All Orders
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
            Recent Orders
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FaShoppingBag className="text-white text-lg" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{order.id}</div>
                  <div className="text-sm text-gray-500">{order.date} • {order.items} items</div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-bold text-gray-800">${order.total}</div>
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${order.statusColor}`}>
                    <order.icon className="text-sm" />
                    {order.status}
                  </div>
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Need Help with Your Order?</h4>
        <p className="text-blue-700 text-sm mb-4">Contact our support team for any order-related questions.</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};
export default MyOrder
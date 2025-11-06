"use client"
import React, { useState } from 'react';

import { 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye,
  Download,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  ArrowUpDown
} from 'lucide-react';
import Link from 'next/link';

const OrdersTable = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);

  const orders = [
    {
      id: 'ORD-7842',
      customer: 'John Smith',
      email: 'john.smith@email.com',
      date: 'Jan 15, 2024',
      status: 'completed',
      statusText: 'Completed',
      amount: '$245.99',
      items: 3,
      payment: 'Credit Card',
      shipping: 'Express'
    },
    {
      id: 'ORD-7841',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      date: 'Jan 15, 2024',
      status: 'processing',
      statusText: 'Processing',
      amount: '$189.50',
      items: 2,
      payment: 'PayPal',
      shipping: 'Standard'
    },
    {
      id: 'ORD-7840',
      customer: 'Mike Chen',
      email: 'mike.chen@email.com',
      date: 'Jan 14, 2024',
      status: 'shipped',
      statusText: 'Shipped',
      amount: '$542.75',
      items: 5,
      payment: 'Credit Card',
      shipping: 'Express'
    },
    {
      id: 'ORD-7839',
      customer: 'Emily Davis',
      email: 'emily.davis@email.com',
      date: 'Jan 14, 2024',
      status: 'pending',
      statusText: 'Pending',
      amount: '$89.99',
      items: 1,
      payment: 'Credit Card',
      shipping: 'Standard'
    },
    {
      id: 'ORD-7838',
      customer: 'Robert Wilson',
      email: 'rob.wilson@email.com',
      date: 'Jan 13, 2024',
      status: 'cancelled',
      statusText: 'Cancelled',
      amount: '$156.30',
      items: 2,
      payment: 'PayPal',
      shipping: 'Standard'
    },
    {
      id: 'ORD-7837',
      customer: 'Lisa Brown',
      email: 'lisa.b@email.com',
      date: 'Jan 13, 2024',
      status: 'completed',
      statusText: 'Completed',
      amount: '$324.15',
      items: 4,
      payment: 'Credit Card',
      shipping: 'Express'
    },
    {
      id: 'ORD-7836',
      customer: 'David Miller',
      email: 'd.miller@email.com',
      date: 'Jan 12, 2024',
      status: 'shipped',
      statusText: 'Shipped',
      amount: '$78.45',
      items: 1,
      payment: 'Credit Card',
      shipping: 'Standard'
    },
    {
      id: 'ORD-7835',
      customer: 'Jennifer Lee',
      email: 'j.lee@email.com',
      date: 'Jan 12, 2024',
      status: 'processing',
      statusText: 'Processing',
      amount: '$210.80',
      items: 3,
      payment: 'PayPal',
      shipping: 'Express'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'processing':
        return <Clock size={16} className="text-blue-600" />;
      case 'shipped':
        return <Truck size={16} className="text-purple-600" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length
        ? []
        : orders.map(order => order.id)
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Printer size={20} />
            <span>Print</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">1,248</p>
              <p className="text-sm text-green-600 mt-1">+12% from last month</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">24</p>
              <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$24,589</p>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">$156.80</p>
              <p className="text-sm text-green-600 mt-1">+5% from last month</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <ArrowUpDown size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="lg:w-48">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-12 py-4 px-6">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={toggleAllOrders}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Order ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Items</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-blue-600">{order.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{order.date}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                        {order.statusText}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {order.items} items
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">{order.payment}</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {order.shipping}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/orders/edit/${order.id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Order"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel Order"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-blue-800">
                {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
              </p>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Mark as Processing
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                  Mark as Shipped
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                  Cancel Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of{' '}
              <span className="font-medium">1,248</span> orders
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
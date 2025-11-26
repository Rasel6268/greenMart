"use client";
import React, { useState } from "react";
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
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from 'sweetalert2';

const OrdersTable = () => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const queryClient = useQueryClient();

  // Fetch orders
  const {
    data: ordersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      return res.data;
    },
  });

  const orders = ordersData?.data || [];

  // Bulk update mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ orderIds, status }) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/bulk-update-status`,
        { orderIds, status }
      );
      return res.data;
    },
    onSuccess: (data) => {
      // Refresh the orders data
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Clear selection
      setSelectedOrders([]);
      
      Swal.fire({
        title: "Success!",
        text: data.message || "Orders updated successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    },
    onError: (error) => {
      console.error('Bulk update failed:', error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || 'Failed to update orders',
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  });

  // Bulk action handlers with SweetAlert2 confirmations
  const handleBulkProcessing = () => {
    if (selectedOrders.length === 0) return;
    
    Swal.fire({
      title: "Mark as Processing?",
      text: `You are about to mark ${selectedOrders.length} order(s) as processing.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as processing!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        bulkUpdateMutation.mutate({
          orderIds: selectedOrders,
          status: 'processing'
        });
      }
    });
  };

  const handleBulkShipped = () => {
    if (selectedOrders.length === 0) return;
    
    Swal.fire({
      title: "Mark as Shipped?",
      text: `You are about to mark ${selectedOrders.length} order(s) as shipped.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as shipped!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        bulkUpdateMutation.mutate({
          orderIds: selectedOrders,
          status: 'shipped'
        });
      }
    });
  };

  const handleBulkCompleted = () => {
    if (selectedOrders.length === 0) return;
    
    Swal.fire({
      title: "Mark as Completed?",
      text: `You are about to mark ${selectedOrders.length} order(s) as completed.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark as completed!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        bulkUpdateMutation.mutate({
          orderIds: selectedOrders,
          status: 'completed'
        });
      }
    });
  };

  const handleBulkCancelled = () => {
    if (selectedOrders.length === 0) return;
    
    Swal.fire({
      title: "Cancel Orders?",
      text: `You are about to cancel ${selectedOrders.length} order(s). This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel orders!",
      cancelButtonText: "Keep orders"
    }).then((result) => {
      if (result.isConfirmed) {
        bulkUpdateMutation.mutate({
          orderIds: selectedOrders,
          status: 'cancelled'
        });
      }
    });
  };

  const handleBulkConfirmed = () => {
    if (selectedOrders.length === 0) return;
    
    Swal.fire({
      title: "Confirm Orders?",
      text: `You are about to confirm ${selectedOrders.length} order(s).`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm orders!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        bulkUpdateMutation.mutate({
          orderIds: selectedOrders,
          status: 'confirmed'
        });
      }
    });
  };

  // Helper functions (keep your existing ones)
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "processing":
        return <Clock size={16} className="text-blue-600" />;
      case "shipped":
        return <Truck size={16} className="text-purple-600" />;
      case "confirmed":
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "confirmed":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "Confirmed";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status || "Pending";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalItems = (products) => {
    return products?.reduce((total, product) => total + product.quantity, 0) || 0;
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const toggleAllOrders = () => {
    setSelectedOrders(
      selectedOrders.length === orders.length
        ? []
        : orders.map((order) => order._id)
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-red-600">Error loading orders: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Manage customer orders and fulfillment
          </p>
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
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {ordersData?.totalOrders || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +12% from last month
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {orders.filter(order => 
                  ['pending', 'confirmed'].includes(order.orderStatus?.toLowerCase())
                ).length}
              </p>
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
              <p className="text-sm font-medium text-gray-600">
                This Month Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${orders.reduce((total, order) => total + order.payment.amount.total, 0).toFixed(2)}
              </p>
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
              <p className="text-sm font-medium text-gray-600">
                Avg. Order Value
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${orders.length > 0 ? (orders.reduce((total, order) => total + order.payment.amount.total, 0) / orders.length).toFixed(2) : '0.00'}
              </p>
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
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
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
              <option value="confirmed">Confirmed</option>
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
                    checked={
                      selectedOrders.length === orders?.length &&
                      orders?.length > 0
                    }
                    onChange={toggleAllOrders}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Items
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Payment
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => toggleOrderSelection(order._id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-blue-600">
                      {order.orderId}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.customer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.orderStatus)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          order.orderStatus
                        )}`}
                      >
                        {getStatusText(order.orderStatus)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">
                      ${order.payment.amount.total}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {getTotalItems(order.products)} items
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700 capitalize">
                        {order.payment.method}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium capitalize">
                        {order.payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/orders/${order._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/dashboard/orders/edit/${order._id}`}
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
                {selectedOrders.length} order
                {selectedOrders.length > 1 ? "s" : ""} selected
                {bulkUpdateMutation.isPending && " - Updating..."}
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={handleBulkConfirmed}
                  disabled={bulkUpdateMutation.isPending}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Confirmed
                </button>
                <button 
                  onClick={handleBulkProcessing}
                  disabled={bulkUpdateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Processing
                </button>
                <button 
                  onClick={handleBulkShipped}
                  disabled={bulkUpdateMutation.isPending}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Shipped
                </button>
                <button 
                  onClick={handleBulkCompleted}
                  disabled={bulkUpdateMutation.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Mark as Completed
                </button>
                <button 
                  onClick={handleBulkCancelled}
                  disabled={bulkUpdateMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel Orders
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {orders?.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{orders.length}</span> of{" "}
              <span className="font-medium">{ordersData?.totalOrders || 0}</span> orders
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
import { useAuth } from "@/Hooks/useAuth";
import apiClient from "@/lib/apiClient";
import instance from "@/lib/instance";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaShoppingBag,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaTrash,
  FaExclamationTriangle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ITEMS_PER_PAGE = 5; // This should match your backend limit

const MyOrder = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["myOrder", user?.email, currentPage],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await apiClient.get(
        `/orders/my_order?email=${user.email}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      return res?.data || {};
    },
  });

  // Extract data from response
  const orders = data?.my_order || [];
  const totalOrders = data?.totalOrders || 0;
  const totalPages = data?.totalPages || 1;

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const res = await instance.delete(`/orders/${orderId}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate all pages to refresh data
      queryClient.invalidateQueries(["myOrder", user?.email]);
      setCancelOrderId(null);
    },
    onError: (error) => {
      console.error("Error cancelling order:", error);
      setCancelOrderId(null);
    },
  });

  const handleCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
    cancelOrderMutation.mutate(orderId);
  };

  const getStatusInfo = (order) => {
    switch (order.orderStatus) {
      case "delivered":
        return {
          text: "Delivered",
          color: "text-green-600 bg-green-100",
          icon: FaCheckCircle,
        };
      case "confirmed":
        return {
          text: "Confirmed",
          color: "text-blue-600 bg-blue-100",
          icon: FaCheckCircle,
        };
      case "processing":
        return {
          text: "Processing",
          color: "text-orange-600 bg-orange-100",
          icon: FaClock,
        };
      case "shipped":
        return {
          text: "Shipped",
          color: "text-purple-600 bg-purple-100",
          icon: FaTruck,
        };
      case "out_for_delivery":
        return {
          text: "Out for Delivery",
          color: "text-indigo-600 bg-indigo-100",
          icon: FaTruck,
        };
      case "cancelled":
        return {
          text: "Cancelled",
          color: "text-red-600 bg-red-100",
          icon: FaTimesCircle,
        };
      default:
        return {
          text: "Pending",
          color: "text-gray-600 bg-gray-100",
          icon: FaClock,
        };
    }
  };
  ;
  const getPaymentStatus = (order) => {
    switch (order.payment?.status) {
      case "success":
        return { text: "Paid", color: "text-green-600" };
      case "pending":
        return { text: "Pending", color: "text-orange-600" };
      case "FAILED":
        return { text: "Failed", color: "text-red-600" };
      case "CANCELLED":
        return { text: "Canceled", color: "text-red-600" };
      default:
        return { text: "Pending", color: "text-gray-600" };
    }
  };

  const canCancelOrder = (order) => {
    return order.orderStatus === "pending" || order.orderStatus === "confirmed";
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };

    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalOrders);

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
        <div className="text-sm text-gray-600">
          Showing {startItem}-{endItem} of {totalOrders} orders
        </div>

        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaChevronLeft className="text-xs" />
            Previous
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-green-500 text-white border border-green-500"
                  : "text-gray-600 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <FaShoppingBag className="mx-auto text-6xl text-gray-300 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No Orders Found
        </h3>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Order History</h3>
        <div className="text-sm text-gray-500">
          {totalOrders} order{totalOrders !== 1 ? "s" : ""} found
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Order Info
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Items
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Total
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Payment
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order);
              const paymentStatus = getPaymentStatus(order);
              const StatusIcon = statusInfo.icon;
              const canCancel = canCancelOrder(order);

              return (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FaShoppingBag className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">
                          {order.orderId}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.tran_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-800">
                      {order.products?.length || 0} item
                      {order.products?.length !== 1 ? "s" : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-800">
                      ৳
                      {order.payment?.amount?.total ||
                        order.payment?.total ||
                        0}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${paymentStatus.color}`}
                    >
                      {paymentStatus.text}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon className="text-xs" />
                      {statusInfo.text}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={
                            cancelOrderMutation.isLoading &&
                            cancelOrderId === order._id
                          }
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Cancel Order"
                        >
                          {cancelOrderMutation.isLoading &&
                          cancelOrderId === order._id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FaTrash className="text-sm" />
                          )}
                        </button>
                      )}
                      {!canCancel && (
                        <span
                          className="p-2 text-gray-400 cursor-not-allowed"
                          title="Cannot cancel this order"
                        >
                          <FaTimesCircle className="text-sm" />
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination for Desktop */}
        <div className="border-t border-gray-200 px-6 py-4">
          <Pagination />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {orders.map((order) => {
          const statusInfo = getStatusInfo(order);
          const paymentStatus = getPaymentStatus(order);
          const StatusIcon = statusInfo.icon;
          const canCancel = canCancelOrder(order);

          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <FaShoppingBag className="text-white text-sm" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {order.orderId}
                    </div>
                    <div className="text-xs text-gray-500">{order.tran_id}</div>
                  </div>
                </div>
                <div
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                >
                  <StatusIcon className="text-xs" />
                  {statusInfo.text}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-500">Date</div>
                  <div className="font-medium text-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Items</div>
                  <div className="font-medium text-gray-800">
                    {order.products?.length || 0} item
                    {order.products?.length !== 1 ? "s" : ""}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Total</div>
                  <div className="font-medium text-gray-800">
                    ৳{order.payment?.amount?.total || order.payment?.total || 0}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Payment</div>
                  <div className={`font-medium ${paymentStatus.color}`}>
                    {paymentStatus.text}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                  {canCancel && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={
                        cancelOrderMutation.isLoading &&
                        cancelOrderId === order._id
                      }
                      className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {cancelOrderMutation.isLoading &&
                      cancelOrderId === order._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <FaTrash className="text-sm" />
                          Cancel
                        </>
                      )}
                    </button>
                  )}
                </div>
                {!canCancel && (
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <FaExclamationTriangle />
                    Cannot cancel
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Pagination for Mobile */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default MyOrder;

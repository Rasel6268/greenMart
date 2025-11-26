// app/dashboard/orders/[id]/page.jsx
"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeft,
  Download,
  Printer,
  Edit,
  Truck,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

const OrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id;
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`
      );
      return res.data.data;
    },
  });

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (status) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="text-green-600" />;
      case "processing":
        return <Clock className="text-blue-600" />;
      case "shipped":
        return <Truck className="text-purple-600" />;
      case "confirmed":
        return <Clock className="text-yellow-600" />;
      case "cancelled":
        return <XCircle className="text-red-600" />;
      default:
        return <Package className="text-gray-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "confirmed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleStatusUpdate = (newStatus) => {
    Swal.fire({
      title: `Update to ${newStatus}?`,
      text: `Are you sure you want to update this order status to ${newStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, update to ${newStatus}`,
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate(newStatus, {
          onSuccess: () => {
            Swal.fire({
              title: "Updated!",
              text: `Order status has been updated to ${newStatus}.`,
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
          },
          onError: (error) => {
            Swal.fire({
              title: "Error!",
              text: error.response?.data?.message || "Failed to update status",
              icon: "error",
              confirmButtonColor: "#d33",
            });
          },
        });
      }
    });
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice`,
        {
          responseType: "blob",
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${order.orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      Swal.fire({
        title: "Success!",
        text: "Invoice downloaded successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Download error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to download invoice",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handlePrintInvoice = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, "_blank");
      
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error("Print error:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to print invoice",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-lg">
          Error loading order: {error.message}
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Orders
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.orderId}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-3 mt-4 lg:mt-0">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} className="mr-2" />
                Download Invoice
              </button>
              <button
                onClick={handlePrintInvoice}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer size={20} className="mr-2" />
                Print
              </button>
              <Link
                href={`/dashboard/orders/edit/${orderId}`}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit size={20} className="mr-2" />
                Edit
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Status
                </h2>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.orderStatus)}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusClass(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap gap-2">
                {["confirmed", "processing", "shipped", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={updateStatusMutation.isPending}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize ${
                        order.orderStatus === status
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Items
              </h2>
              <div className="space-y-4">
                {order.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package size={24} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          SKU: {product.productId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${product.price ? product.price.toFixed(2) : "0.00"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {product.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-medium capitalize">{order.payment.method}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium capitalize">{order.payment.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-medium">{order.tran_id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2" />
                Customer Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User size={16} className="text-gray-400 mr-2" />
                  <span className="font-medium">{order.customer.name}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.customer.phone}</span>
                </div>
                {order.address && (
                  <div className="flex items-start">
                    <MapPin size={16} className="text-gray-400 mr-2 mt-1" />
                    <div>
                      <p className="text-gray-600">{order.address.street}</p>
                      <p className="text-gray-600">
                        {order.address.city}, {order.address.state} {order.address.zipCode}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.payment.amount.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-red-600">
                    -${order.payment.amount.discount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.payment.amount.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${order.payment.amount.shipping}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${order.payment.amount.total}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Shipping Method</p>
                  <p className="font-medium">{order.shipping?.method || "Standard"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">{order.shipping?.estimated_delivery || "3-5 business days"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Shipping Cost</p>
                  <p className="font-medium">${order.payment.amount.shipping.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
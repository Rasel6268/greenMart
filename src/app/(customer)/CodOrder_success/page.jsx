"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CheckCircle, Clock, Download, Home, Package } from "lucide-react";
import Link from "next/link";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const orderId = searchParams.get("orderId");
  const status = searchParams.get("status");
  const total = searchParams.get("total");

  useEffect(() => {
    // Validate required parameters
    if (!orderId || !status || !total) {
      router.push("/");
      return;
    }

    // Simulate loading state for better UX
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [orderId, status, total, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order is being processed.
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg inline-block">
            <p className="text-blue-800 font-medium">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Order Summary */}
          <div className="p-8 border-b">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full ${
                      status === "completed" ? "bg-green-100" : "bg-yellow-100"
                    }`}
                  >
                    {status === "completed" ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Status</h3>
                    <p className="text-gray-600 capitalize">{status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-gray-900">Total Amount</h3>
                  <p className="text-3xl font-bold text-gray-900">৳ {total}</p>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">
                    Estimated Delivery
                  </p>
                  <p className="text-gray-600">3-5 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              What's Next?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">1</span>
                </div>
                <p className="ml-3 text-gray-600">
                  You will receive an order confirmation email shortly
                </p>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">2</span>
                </div>
                <p className="ml-3 text-gray-600">
                  We'll notify you when your order ships
                </p>
              </li>
              <li className="flex items-start">
                <div className="shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-sm font-semibold text-blue-600">3</span>
                </div>
                <p className="ml-3 text-gray-600">
                  Track your order in real-time from your account
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>

          {/* <button
            onClick={() => {
              // Implement download invoice functionality
              alert("Invoice download will be implemented here");
            }}
            className="flex-1 inline-flex items-center justify-center px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Invoice
          </button> */}

          <Link
            href="/myorder"
            className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Orders
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Contact Support
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link
              href="/faq"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              FAQ
            </Link>
            <span className="hidden sm:inline text-gray-300">|</span>
            <Link
              href="/return-policy"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

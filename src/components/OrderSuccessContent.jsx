"use client";
import { useSearchParams } from "next/navigation";
import React from "react";

const OrderSuccessContent = () => {
  const searchParams = useSearchParams();

  const tran_id = searchParams.get("tran_id");
  const val_id = searchParams.get("val_id");
  const amount = searchParams.get("amount");
  const status = searchParams.get("status");
  const clear_cart = searchParams.get("clear_cart");
  const card_category = searchParams.get("card_category");

  console.log("Transaction ID:", tran_id);
  console.log("All params:", {
    tran_id,
    val_id,
    amount,
    status,
    clear_cart,
    card_category
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transaction ID
              </label>
              <p className="text-gray-900 font-medium">
                {tran_id || "74543563"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validation ID
              </label>
              <p className="text-gray-900 font-medium">
                {val_id || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <p className="text-gray-900 font-medium">
                {card_category ? `${card_category.toUpperCase()} Card` : "Online"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount Paid
              </label>
              <p className="text-green-600 font-bold text-lg">
                ৳{amount || "4546"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <p className={`font-medium ${
                status === 'success' ? 'text-green-600' : 
                status === 'failed' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {status ? status.toUpperCase() : 'SUCCESS'}
              </p>
            </div>
            {clear_cart && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cart Cleared
                </label>
                <p className="text-gray-900 font-medium">
                  {clear_cart === 'true' ? 'Yes' : 'No'}
                </p>
              </div>
            )}
          </div>
          
          {5 > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-3">
                {[1,2,3,4,5].map((product, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Product {index + 1}</span>
                      <span className="text-gray-500 text-sm">x 1</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      ৳ 5654
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You will receive an order confirmation email shortly
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              We'll notify you when your order ships
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessContent;
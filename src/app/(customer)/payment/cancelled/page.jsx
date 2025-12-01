'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function PaymentCancelled() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [transactionData, setTransactionData] = useState(null);

  useEffect(() => {
    // Get data from URL parameters
    const tranId = searchParams.get('tran_id');
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    const amount = searchParams.get('amount');

    if (tranId) {
      setTransactionData({
        tran_id: tranId,
        status: status || 'cancelled',
        error: error || 'Cancelled by User',
        amount: amount
      });
    }

    // Countdown for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, router]);

 

  

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-red-50 px-6 py-4 border-b border-red-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-red-900">Payment Cancelled</h1>
                  <p className="text-red-700 text-sm">Transaction was not completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Transaction Details</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-900 font-medium">
                    {transactionData?.tran_id || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-red-600 font-medium capitalize">
                    {transactionData?.status || 'cancelled'}
                  </span>
                </div>
                {transactionData?.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="text-gray-900 font-medium">
                      ৳{parseFloat(transactionData.amount).toFixed(2)}
                    </span>
                  </div>
                )}
                {transactionData?.error && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reason:</span>
                    <span className="text-red-600 text-right max-w-xs">
                      {transactionData.error}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <p className="text-gray-700 mb-4">
                Your payment process was cancelled. No charges have been made to your account.
              </p>
              <p className="text-sm text-gray-600">
                You will be redirected to the homepage in{' '}
                <span className="font-bold text-gray-900">{countdown}</span> seconds...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              
              
              <button
              
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Contact Support
              </button>

              <button
                onClick={handleGoHome}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Go to Homepage
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-600">
                Need immediate help? Contact our support team at{' '}
                <a href="mailto:support@yourapp.com" className="text-blue-600 hover:text-blue-800">
                  support@yourapp.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
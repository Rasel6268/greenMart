"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/Hooks/useCart';

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clearCartFlag = searchParams.get('clear_cart');
    const tran_id = searchParams.get('tran_id');
    const order_id = searchParams.get('order_id');
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    console.log('Order success page params:', {
      clearCartFlag,
      tran_id,
      order_id,
      status,
      type
    });

    // Clear cart if clear_cart flag is set or it's a successful payment
    if (clearCartFlag === 'true' || status === 'success' || type === 'cod') {
      console.log('🟢 Clearing cart and localStorage...');
      clearCart();
      localStorage.removeItem('pendingOrder');
      localStorage.removeItem('cart'); // Clear any persisted cart data
    }

    // Get order details from localStorage or API
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      try {
        const orderData = JSON.parse(pendingOrder);
        setOrderDetails(orderData);
        console.log('🟢 Found pending order:', orderData);
      } catch (error) {
        console.error('🔴 Error parsing pending order:', error);
      }
    }

    // If no order data found, try to fetch from API using tran_id or order_id
    if ((!pendingOrder && tran_id) || order_id) {
      fetchOrderDetails(tran_id || order_id);
    } else {
      setLoading(false);
    }

    // Clean up function
    return () => {
      // Ensure cart is cleared when component unmounts
      if (clearCartFlag === 'true') {
        localStorage.removeItem('pendingOrder');
      }
    };
  }, [searchParams, clearCart]);

  const fetchOrderDetails = async (identifier) => {
    try {
      // You can call your API to get order details
      // const response = await axios.get(`${baseUrl}/api/orders/${identifier}`);
      // setOrderDetails(response.data.order);
      console.log('🟡 Would fetch order details for:', identifier);
    } catch (error) {
      console.error('🔴 Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get display information
  const getDisplayInfo = () => {
    const tran_id = searchParams.get('tran_id');
    const order_id = searchParams.get('order_id');
    const type = searchParams.get('type');

    if (orderDetails) {
      return {
        orderId: orderDetails.order_id || 'N/A',
        transactionId: orderDetails.tran_id || tran_id,
        amount: orderDetails.total,
        customerName: orderDetails.firstName ? `${orderDetails.firstName} ${orderDetails.lastName}` : 'Customer',
        paymentMethod: type === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        products: orderDetails.products || []
      };
    }

    return {
      orderId: order_id || 'Processing...',
      transactionId: tran_id || 'N/A',
      amount: 'Calculating...',
      customerName: 'Customer',
      paymentMethod: type === 'cod' ? 'Cash on Delivery' : 'Online Payment',
      products: []
    };
  };

  const displayInfo = getDisplayInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successful!</h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
              <p className="text-gray-900 font-medium">{displayInfo.orderId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID</label>
              <p className="text-gray-900 font-medium">{displayInfo.transactionId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <p className="text-gray-900 font-medium">{displayInfo.paymentMethod}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
              <p className="text-green-600 font-bold text-lg">৳{typeof displayInfo.amount === 'number' ? displayInfo.amount.toFixed(2) : displayInfo.amount}</p>
            </div>
          </div>

          {/* Order Summary */}
          {displayInfo.products.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-3">
                {displayInfo.products.map((product, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">{product.name}</span>
                      <span className="text-gray-500 text-sm">x{product.quantity}</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      ৳{((product.price || 0) * (product.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You will receive an order confirmation email shortly
            </li>
            {displayInfo.paymentMethod === 'Cash on Delivery' ? (
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pay when your order is delivered
              </li>
            ) : (
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment has been processed successfully
              </li>
            )}
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              We'll notify you when your order ships
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Continue Shopping
          </Link>
          
          <Link
            href="/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            View My Orders
          </Link>
          
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-xl transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go Home
          </button>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Need help? <Link href="/contact" className="text-green-600 hover:text-green-700 font-medium">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
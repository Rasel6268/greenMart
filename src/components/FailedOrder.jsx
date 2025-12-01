'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Failed = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [countdown, setCountdown] = useState(15);
    
    const tran_id = searchParams.get("tran_id");
    const error = searchParams.get('error');
    const amount = searchParams.get('amount');
    const tran_date = searchParams.get("tran_date");
    
    useEffect(() => {
        // Countdown timer for automatic redirect
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
    }, [router]);

    const handleRetryPayment = () => {
        // Retry with same transaction ID if available
        if (tran_id && amount) {
            router.push(`/payment?tran_id=${tran_id}&amount=${amount}`);
        } else {
            router.push('/payment');
        }
    };

    const handleContactSupport = () => {
        const subject = `URGENT: Payment Failed - Transaction ID: ${tran_id || 'N/A'}`;
        const body = `Payment Failure Report:\n\n` +
            `Transaction ID: ${tran_id || 'N/A'}\n` +
            `Amount: $${amount || '0.00'}\n` +
            `Error: ${error || 'Unknown error'}\n` +
            `Date: ${tran_date || new Date().toLocaleDateString()}\n\n` +
            `Details: The payment failed but amount might have been deducted from my account.\n` +
            `Please investigate and refund if necessary.\n\n` +
            `Contact me immediately regarding this issue.`;
        
        window.location.href = `mailto:support@yourapp.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleCheckTransactions = () => {
        router.push('/dashboard/transactions');
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center p-4">
            {/* SSL Security Header */}
            <div className="w-full max-w-2xl mb-6">
                <div className="bg-white rounded-lg shadow-sm border border-green-200 p-3 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-700 text-sm font-medium">
                        🔒 256-bit SSL Secured Payment • PCI DSS Compliant
                    </span>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-red-200 w-full max-w-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-linear-to-r from-red-600 to-red-700 px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Payment Failed</h1>
                                <p className="text-red-100">Transaction could not be completed</p>
                            </div>
                        </div>
                        <div className="bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                            <span className="text-white font-semibold">
                                {amount ? `$${parseFloat(amount).toFixed(2)}` : 'Amount N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Alert Banner */}
                <div className="bg-red-50 border-b border-red-200 px-8 py-4">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                            <p className="text-red-800 font-medium">Important: Payment unsuccessful</p>
                            <p className="text-red-700 text-sm mt-1">
                                If money was deducted from your account, it will be automatically refunded within 5-7 business days.
                                Contact support if refund doesn't appear.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-8 py-6">
                    {/* Transaction Details */}
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Transaction ID</p>
                                        <p className="font-mono text-gray-900 font-medium text-lg">{tran_id || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                            Failed
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Amount</p>
                                        <p className="text-2xl font-bold text-red-700">
                                            {amount ? `$${parseFloat(amount).toFixed(2)}` : '$0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Date & Time</p>
                                        <p className="text-gray-900 font-medium">
                                            {tran_date ? new Date(tran_date).toLocaleString() : new Date().toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Error Details</h3>
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                    <svg className="w-5 h-5 text-red-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Steps to Follow */}
                    <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4">What to do next?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mx-auto mb-3">
                                    1
                                </div>
                                <p className="font-medium text-blue-800 mb-2">Check Bank Statement</p>
                                <p className="text-blue-700 text-sm">Verify if amount was deducted from your account</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mx-auto mb-3">
                                    2
                                </div>
                                <p className="font-medium text-blue-800 mb-2">Contact Support</p>
                                <p className="text-blue-700 text-sm">If amount was deducted, contact us immediately for refund</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border border-blue-100">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mx-auto mb-3">
                                    3
                                </div>
                                <p className="font-medium text-blue-800 mb-2">Try Again</p>
                                <p className="text-blue-700 text-sm">Retry payment or use different payment method</p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                        <button
                            onClick={handleRetryPayment}
                            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md"
                        >
                            Try Payment Again
                        </button>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleCheckTransactions}
                                className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg border border-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Check Transaction History
                            </button>
                            
                            <button
                                onClick={handleContactSupport}
                                className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg border border-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
                            >
                                Contact Support (Urgent)
                            </button>
                        </div>
                        
                        <button
                            onClick={handleGoHome}
                            className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 px-4 transition duration-200"
                        >
                            Return to Homepage
                        </button>
                    </div>

                    {/* Countdown */}
                    <div className="mt-8 pt-6 border-t text-center">
                        <p className="text-gray-600">
                            You will be automatically redirected to homepage in{' '}
                            <span className="font-bold text-gray-900 text-lg">{countdown}</span> seconds
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-8 py-4 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-gray-600">
                                Need immediate help? 
                                <a href="tel:+18001234567" className="text-blue-600 hover:text-blue-800 font-medium ml-2">
                                    +1-800-123-4567
                                </a>
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-gray-600">PCI DSS</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-gray-600">3D Secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Support Information */}
            <div className="mt-8 text-center max-w-2xl">
                <p className="text-sm text-gray-600">
                    For faster assistance, include your Transaction ID ({tran_id || 'N/A'}) when contacting support.
                    Our team is available 24/7 to help resolve payment issues.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                    <a href="mailto:support@yourapp.com" className="text-blue-600 hover:text-blue-800 text-sm">
                        ✉️ support@yourapp.com
                    </a>
                    <a href="/help/refund-policy" className="text-blue-600 hover:text-blue-800 text-sm">
                        📄 Refund Policy
                    </a>
                    <a href="/help/payment-faq" className="text-blue-600 hover:text-blue-800 text-sm">
                        ❓ Payment FAQ
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Failed;
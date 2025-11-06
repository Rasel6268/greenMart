"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "iPhone 16 Pro Max",
            description: "This product comes with a 3-year warranty, ensuring long-lasting quality and peace of mind.",
            price: 1880,
            quantity: 1,
            image: "/iphone.png",
            inStock: true
        },
        {
            id: 2,
            name: "AirPods Pro",
            description: "Active noise cancellation for immersive sound.",
            price: 250,
            quantity: 2,
            image: "/airpods.png",
            inStock: true
        },
        {
            id: 3,
            name: "Apple Watch Series 9",
            description: "Advanced health monitoring and fitness tracking.",
            price: 400,
            quantity: 1,
            image: "/apple-watch.png",
            inStock: false
        }
    ]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = 80;
    const discount = 200;
    const total = subtotal + shippingFee - discount;

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-gray-600 mt-2">
                        {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-white rounded-xl shadow-sm">
                            <Link 
                                href="/shop" 
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Continue Shopping
                            </Link>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setCartItems([])}
                                    className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Clear Cart
                                </button>
                                <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                                    Update Cart
                                </button>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-6">
                                            {/* Product Image */}
                                            <div className="relative">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={120}
                                                    height={120}
                                                    className="rounded-lg object-cover"
                                                />
                                                {!item.inStock && (
                                                    <div className="absolute inset-0 bg-red-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                            Out of Stock
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                                            <button 
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-green-600">
                                                            ${item.price}
                                                        </p>
                                                        <p className="text-gray-500 text-sm">
                                                            ${item.price} × {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center justify-between mt-6">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                                                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            <span className="w-8 text-center font-medium text-gray-900">
                                                                {item.quantity}
                                                            </span>
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {cartItems.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-600 mb-6">Start adding some products to your cart!</p>
                                <Link 
                                    href="/shop"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-6">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Order Summary</h2>

                                {/* Price Breakdown */}
                                <div className="space-y-3 py-4">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>${shippingFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 text-sm">
                                        <span>Tax estimate</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>

                                <hr className="my-2" />

                                {/* Total */}
                                <div className="flex justify-between items-center py-4">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                                </div>

                                {/* Promo Code */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Promo Code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Enter promo code"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        />
                                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    className="block w-full text-center py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors shadow-lg shadow-green-200 hover:shadow-green-300"
                                >
                                    Proceed to Checkout
                                </Link>

                                {/* Security Badge */}
                                <div className="mt-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                        Secure checkout
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="w-8 h-8 mx-auto mb-2 text-green-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-600">Free Shipping</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="w-8 h-8 mx-auto mb-2 text-green-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-600">Secure Payment</p>
                            </div>
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                <div className="w-8 h-8 mx-auto mb-2 text-green-600">
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-600">Money Back</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
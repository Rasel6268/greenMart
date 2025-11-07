"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCart } from "@/Hooks/useCart";

export default function CartPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const {getCart,saveCart,cart,setCart}  = useCart()
 

 

  //Save cart to localStorage
  // const saveCart = (cart) => {
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("cart", JSON.stringify(cart));
  //   }
  //   setCart(cart);
  // };

  // ✅ Get the correct price tier and label
  const getWholesaleTier = (product, quantity) => {
    if (!product.wholesalePricing || !Array.isArray(product.wholesalePricing)) {
      return { price: product.retailPrice, label: "Retail" };
    }

    const tier = product.wholesalePricing.find((t) => {
      const max = t.maxQty === null ? Infinity : t.maxQty;
      return quantity >= t.minQty && quantity <= max;
    });

    return tier
      ? { price: tier.price, label: tier.label }
      : { price: product.retailPrice, label: "Retail" };
  };

  // Fetch product details for cart items
  const fetchCartProducts = async () => {
    const cartItems = getCart();
    setCart(cartItems);

    if (cartItems.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3001/products");
      const allProducts = res.data.products || res.data;

      const selectedProducts = allProducts.filter((p) =>
        cartItems.some((c) => c.id === p._id)
      );

      const productsWithQuantity = selectedProducts.map((p) => {
        const cartItem = cartItems.find((c) => c.id === p._id);
        return { ...p, quantity: cartItem.quantity };
      });

      setProducts(productsWithQuantity);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart products:", err);
      setLoading(false);
    }
  };

  // ✅ Calculate total using dynamic wholesale price
  const calculateTotal = () => {
    const total = products.reduce((acc, product) => {
      const { price } = getWholesaleTier(product, product.quantity);
      return acc + price * product.quantity;
    }, 0);
    setTotalPrice(total);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updatedCart);

    const updatedProducts = products.map((p) =>
      p._id === id ? { ...p, quantity } : p
    );
    setProducts(updatedProducts);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
    

    const updatedProducts = products.filter((p) => p._id !== id);
    setProducts(updatedProducts);
    toast.success('Cart remove successfully')
  };

  const clearCart = () => {
    saveCart([]);
    setProducts([]);
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading cart...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Start adding some products to your cart!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
            {cart.reduce((total, item) => total + item.quantity, 0) === 1
              ? "item"
              : "items"}{" "}
            in your cart
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Continue Shopping
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
              {products.map((item) => {
                const { price, label } = getWholesaleTier(item, item.quantity);
                const subtotal = price * item.quantity;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative">
                          <Image
                            src={item.images?.[0] || "/images/placeholder.jpg"}
                            alt={item.name}
                            width={120}
                            height={120}
                            className="rounded-lg object-cover"
                          />
                          {/* Price Tier Badge */}
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            {label}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {item.name}
                                </h3>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-1 ml-4"
                                >
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <p className="text-gray-600 text-sm mt-2">
                                {item.brand && (
                                  <span className="font-medium">
                                    Brand: {item.brand}
                                  </span>
                                )}
                              </p>
                              <p
                                className="text-gray-600 text-sm mt-1 line-clamp-2"
                                title={item.description}
                              >
                                {item.description?.slice(0, 70)}...
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">
                                ${price}
                              </p>
                              <p className="text-gray-500 text-sm">per item</p>
                              <p className="text-xs text-blue-600 mt-1">
                                {label} Price
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-600 font-medium">
                                Quantity:
                              </span>
                              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 12H4"
                                    />
                                  </svg>
                                </button>
                                <span className="w-8 text-center font-medium text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                  }
                                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 4v16m8-8H4"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${subtotal.toFixed(2)}
                              </p>
                              <p className="text-gray-500 text-sm">total</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-6 transition-all duration-200 hover:shadow-xl">
              <div className="p-6">
                {/* Header with icon */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Summary
                  </h2>
                </div>

                {/* Product Items with better styling */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                  {products.map((item, index) => {
                    const { price, label } = getWholesaleTier(
                      item,
                      item.quantity
                    );
                    const subtotal = price * item.quantity;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.quantity} × ${price.toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ${subtotal.toFixed(2)}
                          </p>
                          {label && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                              {label}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown with animations */}
                <div className="space-y-3 py-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Subtotal (
                      {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium text-gray-900">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tax estimate</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>

                  {/* Progress bar for free shipping */}
                  {totalPrice < 200 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between text-sm text-blue-800 mb-2">
                        <span>
                          Add ${(200 - totalPrice).toFixed(2)} for free shipping!
                        </span>
                        <span>
                          {Math.min((totalPrice / 200) * 100, 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min((totalPrice / 50) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-4 border-gray-200" />

                {/* Total with emphasis */}
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 px-6 rounded-lg">
                  <div>
                    <span className="text-lg font-semibold text-gray-900 block">
                      Total
                    </span>
                    <span className="text-sm text-gray-500">
                      Including estimated tax
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600 block">
                      ${totalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">USD</span>
                  </div>
                </div>

                {/* Enhanced Promo Code Section */}
                <div className="my-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Promo Code
                    </label>
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      Have a code?
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Enhanced Checkout Button */}
                <Link
                  href="/checkout"
                  className="group relative block w-full text-center py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-2xl hover:shadow-green-300 transform hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Proceed to Checkout
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

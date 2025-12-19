"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useCart } from "@/Hooks/useCart";
import instance from "@/lib/instance";

export default function CartPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const { getCart, saveCart, cart, setCart } = useCart();
  const [discountAmount, setDiscountAm] = useState(0);
  const [stockErrors, setStockErrors] = useState({}); // Track stock errors per product
  const [outOfStockProducts, setOutOfStockProducts] = useState([]); // Track out of stock products

  const finalPrice = totalPrice - discountAmount;

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

  // Validate stock for a specific product
  const validateProductStock = (product, quantity) => {
    if (!product.stock || product.stock === 0) {
      return { isValid: false, message: "Out of stock" };
    }
    
    if (quantity > product.stock) {
      return { 
        isValid: false, 
        message: `Only ${product.stock} units available`,
        maxAllowed: product.stock 
      };
    }
    
    return { isValid: true, message: "" };
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
      const res = await instance.get('/products');
      const allProducts = res.data.products || res.data;

      const selectedProducts = allProducts.filter((p) =>
        cartItems.some((c) => c.id === p._id)
      );

      const productsWithQuantity = selectedProducts.map((p) => {
        const cartItem = cartItems.find((c) => c.id === p._id);
        const quantity = cartItem.quantity;
        const stockValidation = validateProductStock(p, quantity);
        
        // Set initial stock errors
        if (!stockValidation.isValid) {
          setStockErrors(prev => ({
            ...prev,
            [p._id]: stockValidation.message
          }));
        }

        return { 
          ...p, 
          quantity,
          stockStatus: stockValidation
        };
      });

      // Filter out of stock products
      const inStockProducts = productsWithQuantity.filter(p => p.stockStatus.isValid);
      const outOfStock = productsWithQuantity.filter(p => !p.stockStatus.isValid);
      
      setProducts(inStockProducts);
      setOutOfStockProducts(outOfStock);
      
      // Show toast for out of stock items
      if (outOfStock.length > 0) {
        toast.error(`${outOfStock.length} item(s) removed from cart due to stock issues`);
      }
      
      // Update cart to remove out of stock items
      if (outOfStock.length > 0) {
        const updatedCart = cartItems.filter(item => 
          !outOfStock.some(p => p._id === item.id)
        );
        saveCart(updatedCart);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching cart products:", err);
      setLoading(false);
    }
  };

  // ✅ Calculate total using dynamic wholesale price
  const calculateTotal = () => {
    const { total, discountAmount } = products.reduce(
      (acc, product) => {
        if (!product.stockStatus?.isValid) return acc;
        
        const { price } = getWholesaleTier(product, product.quantity);
        const itemDiscount = (price * (product.discountPercent || 0)) / 100;
        const itemTotal = price  * product.quantity;

        acc.total += itemTotal;
        acc.discountAmount += itemDiscount * product.quantity;

        return acc;
      },
      { total: 0, discountAmount: 0 }
    );

    setTotalPrice(total);
    setDiscountAm(discountAmount);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const product = products.find(p => p._id === id);
    if (!product) return;

    // Validate stock before updating
    const stockValidation = validateProductStock(product, newQuantity);
    
    if (!stockValidation.isValid) {
      // Set error message
      setStockErrors(prev => ({
        ...prev,
        [id]: stockValidation.message
      }));
      
      // If stock available but quantity exceeds, adjust to max stock
      if (stockValidation.maxAllowed && newQuantity > stockValidation.maxAllowed) {
        toast.error(`Cannot exceed available stock of ${stockValidation.maxAllowed} units`);
        newQuantity = stockValidation.maxAllowed;
      } else if (product.stock === 0) {
        toast.error("Product is out of stock");
        removeFromCart(id);
        return;
      }
    } else {
      // Clear error if valid
      setStockErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }

    // Update cart
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);

    // Update products state
    const updatedProducts = products.map((p) =>
      p._id === id ? { 
        ...p, 
        quantity: newQuantity,
        stockStatus: validateProductStock(p, newQuantity)
      } : p
    );
    setProducts(updatedProducts);
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);

    const updatedProducts = products.filter((p) => p._id !== id);
    setProducts(updatedProducts);
    
    // Clear stock error for removed product
    setStockErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[id];
      return newErrors;
    });
    
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    saveCart([]);
    setProducts([]);
    setStockErrors({});
    setOutOfStockProducts([]);
    toast.success("Cart cleared successfully");
  };

  // Check if any product has stock issues
  const hasStockIssues = Object.keys(stockErrors).length > 0 || outOfStockProducts.length > 0;
  
  // Check if checkout should be disabled
  const isCheckoutDisabled = hasStockIssues || products.length === 0;

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

  // Combine both out of stock and in-stock with errors for display
  const allCartItems = [...outOfStockProducts, ...products];
  const hasItems = allCartItems.length > 0;

  if (!hasItems) {
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
          
          {/* Stock Issues Warning */}
          {hasStockIssues && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-700">Stock Issues Detected</h4>
                  <p className="text-red-600 text-sm mt-1">
                    {outOfStockProducts.length > 0 && 
                      `${outOfStockProducts.length} item(s) are out of stock and have been removed. `}
                    {Object.keys(stockErrors).length > 0 && 
                      `${Object.keys(stockErrors).length} item(s) exceed available stock. Please adjust quantities to proceed to checkout.`}
                  </p>
                </div>
              </div>
            </div>
          )}
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

            {/* Out of Stock Items */}
            {outOfStockProducts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-700">Out of Stock Items</h3>
                {outOfStockProducts.map((item) => (
                  <div
                    key={item._id}
                    className="bg-red-50 rounded-xl shadow-sm border border-red-200 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Image
                            src={item.images?.[0] || "/images/placeholder.jpg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-lg object-cover opacity-50"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 line-through">
                            {item.name}
                          </h3>
                          <p className="text-red-600 text-sm mt-1">
                            ⚠️ This item is out of stock and has been removed from your cart.
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            You had {item.quantity} item(s) in your cart.
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
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
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* In Stock Cart Items */}
            <div className="space-y-4">
              {products.map((item) => {
                const { price, label } = getWholesaleTier(item, item.quantity);
                const subtotal = price * item.quantity;
                const stockError = stockErrors[item._id];
                const isStockValid = item.stockStatus?.isValid && !stockError;

                return (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                      !isStockValid ? 'border-red-300' : 'border-gray-100'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="relative">
                          <Image
                            src={item.images?.[0] || "/images/placeholder.jpg"}
                            alt={item.name}
                            width={120}
                            height={120}
                            className={`rounded-lg object-cover ${
                              !isStockValid ? 'opacity-70' : ''
                            }`}
                          />
                          {/* Price Tier Badge */}
                          <div className={`absolute -top-2 -right-2 text-xs px-2 py-1 rounded ${
                            !isStockValid 
                              ? 'bg-red-500 text-white' 
                              : 'bg-blue-500 text-white'
                          }`}>
                            {!isStockValid ? 'Stock Issue' : label}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className={`text-lg font-semibold ${
                                  !isStockValid ? 'text-red-700' : 'text-gray-900'
                                }`}>
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
                              
                              {/* Stock Information */}
                              <div className="mt-2">
                                <p className={`text-sm font-medium ${
                                  !isStockValid ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                    !isStockValid ? 'bg-red-500' : 'bg-green-500'
                                  }`}></span>
                                  {item.stock} units available
                                </p>
                                
                                {/* Stock Error Message */}
                                {stockError && (
                                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 text-sm font-medium">
                                      ⚠️ {stockError}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <p className={`text-xl font-bold ${
                                !isStockValid ? 'text-red-600' : 'text-green-600'
                              }`}>
                                ৳{price}
                              </p>
                              <p className="text-gray-500 text-sm">per item</p>
                              <p className={`text-xs mt-1 ${
                                !isStockValid ? 'text-red-600' : 'text-blue-600'
                              }`}>
                                {!isStockValid ? 'Adjust Quantity' : `${label} Price`}
                              </p>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center gap-4">
                              <span className={`text-sm font-medium ${
                                !isStockValid ? 'text-red-600' : 'text-gray-600'
                              }`}>
                                Quantity:
                              </span>
                              <div className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                                !isStockValid ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                              }`}>
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className={`w-8 h-8 flex items-center justify-center rounded-full border disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                                    !isStockValid
                                      ? 'bg-white border-red-300 hover:bg-red-100'
                                      : 'bg-white border-gray-300 hover:bg-gray-100'
                                  }`}
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
                                <span className={`w-8 text-center font-medium ${
                                  !isStockValid ? 'text-red-700' : 'text-gray-900'
                                }`}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item._id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= item.stock}
                                  className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                    !isStockValid
                                      ? 'bg-white border-red-300 hover:bg-red-100'
                                      : 'bg-white border-gray-300 hover:bg-gray-100'
                                  }`}
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
                              <p className="text-xs text-gray-500">
                                Max: {item.stock}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`text-lg font-semibold ${
                                !isStockValid ? 'text-red-700' : 'text-gray-900'
                              }`}>
                                ৳{subtotal.toFixed(2)}
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
                  <div className={`p-2 rounded-lg ${
                    isCheckoutDisabled ? 'bg-red-50' : 'bg-green-50'
                  }`}>
                    <svg
                      className={`w-6 h-6 ${
                        isCheckoutDisabled ? 'text-red-600' : 'text-green-600'
                      }`}
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

                {/* Checkout Disabled Warning */}
                {isCheckoutDisabled && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p className="text-red-700 font-medium">
                          {products.length === 0 
                            ? "Your cart is empty" 
                            : "Cannot proceed to checkout"}
                        </p>
                        <p className="text-red-600 text-sm mt-1">
                          {hasStockIssues 
                            ? "Please resolve stock issues before checking out" 
                            : "Add items to your cart to continue"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                  {products.map((item, index) => {
                    const { price, label } = getWholesaleTier(
                      item,
                      item.quantity
                    );
                    const subtotal = price * item.quantity;
                    const hasError = stockErrors[item._id];
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          hasError ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            hasError ? 'text-red-700' : 'text-gray-900'
                          }`}>
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.quantity} × ৳{price.toFixed(2)}
                          </p>
                          {hasError && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ {stockErrors[item._id]}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            hasError ? 'text-red-700' : 'text-gray-900'
                          }`}>
                            ৳{subtotal.toFixed(2)}
                          </p>
                          {label && !hasError && (
                            <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full mt-1">
                              {label}
                            </span>
                          )}
                          {hasError && (
                            <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mt-1">
                              Stock Issue
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 py-4 border-t border-gray-100">
                  {/* Subtotal */}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      Subtotal (
                      {cart.reduce((total, item) => total + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium text-gray-900">
                      ৳{totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Discount Section */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 5.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 10l1.293-1.293zm4 0a1 1 0 010 1.414L11.586 10l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-green-800 font-medium">
                          Discount Applied
                        </span>
                      </div>
                      <span className="text-green-700 font-bold text-lg">
                        -৳{discountAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Tax estimate</span>
                    <span className="text-gray-500">
                      Calculated at checkout
                    </span>
                  </div>

                  {/* Free shipping progress */}
                  {totalPrice < 200 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="flex justify-between text-sm text-blue-800 mb-2">
                        <span>
                          Add ৳{(200 - totalPrice).toFixed(2)} for free shipping!
                        </span>
                        <span>
                          {Math.min((totalPrice / 200) * 100, 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${Math.min(
                              (totalPrice / 200) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="my-4 border-gray-200" />

                {/* Total */}
                <div className={`flex justify-between items-center py-4 -mx-6 px-6 rounded-lg ${
                  isCheckoutDisabled 
                    ? 'bg-red-50' 
                    : 'bg-linear-to-r from-green-50 to-emerald-50'
                }`}>
                  <div>
                    <span className="text-lg font-semibold text-gray-900 block">
                      Total
                    </span>
                    <span className="text-sm text-gray-500">
                      Including estimated tax
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold block ${
                      isCheckoutDisabled ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ৳{finalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">BDT</span>
                  </div>
                </div>
                
                {/* Checkout Button */}
                {isCheckoutDisabled ? (
                  <div className="relative block w-full text-center py-4 bg-gray-300 text-gray-500 rounded-xl font-bold cursor-not-allowed">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {hasStockIssues ? 'Resolve Stock Issues' : 'Cart is Empty'}
                    </span>
                  </div>
                ) : (
                  <Link
                    href="/checkout"
                    className="group relative block w-full text-center py-4 bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg shadow-green-200 hover:shadow-2xl hover:shadow-green-300 transform hover:-translate-y-1"
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
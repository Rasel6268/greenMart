"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useCart } from "@/Hooks/useCart";

export default function CheckoutPage() {
  const [shippingCost, setShippingCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [districts, setDistricts] = useState([]);
  const [upozilas, setUpozilas] = useState([]);
  const [loading, setLoading] = useState(false);
  const { cart } = useCart();
  const [products, setProducts] = useState([]);
  const [discountAmount, setDiscountAm] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      district: "",
      upozila: "",
      phone: "",
      saveInfo: false,
      paymentMethod: "cashOnDelivery",
    },
  });

  const watchDistrict = watch("district");
  const watchUpozila = watch("upozila");

  // Fetch districts from API
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${baseUrl}/district/all`);
        setDistricts(response.data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, [baseUrl]);

  // Fetch upozilas when district changes
  useEffect(() => {
    const fetchUpozilasByDistrict = async () => {
      if (!watchDistrict) {
        setUpozilas([]);
        return;
      }

      try {
        // Find district name from ID
        const selectedDistrict = districts.find((d) => d._id === watchDistrict);
        if (selectedDistrict) {
          const response = await axios.get(
            `${baseUrl}/upozila/${selectedDistrict.name}`
          );
          setUpozilas(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching upozilas:", error);
        setUpozilas([]);
      }
    };

    fetchUpozilasByDistrict();
  }, [watchDistrict, districts, baseUrl]);

  // Update shipping cost when upozila changes
  useEffect(() => {
    if (watchUpozila && upozilas.length > 0) {
      const selectedUpozila = upozilas.find((u) => u._id === watchUpozila);
      if (selectedUpozila) {
        setShippingCost(selectedUpozila.shippingCost);
      }
    } else {
      setShippingCost(0);
    }
  }, [watchUpozila, upozilas]);

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setValue("district", districtId);
    setValue("upozila", "");
    setShippingCost(0);
  };

  const handleUpozilaChange = (e) => {
    const upozilaId = e.target.value;
    setValue("upozila", upozilaId);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Form submitted:", data);

    try {
      if (data.paymentMethod === "sslCommerce") {
        // Redirect to SSL Commerce gateway
        console.log("Redirecting to SSL Commerce...");
        // Add your SSL Commerce integration here
      } else {
        // Process cash on delivery order
        console.log("Processing Cash on Delivery order...");

        // Create order with shipping details
        const orderData = {
          ...data,
          shippingCost,
          products: products,
          total: finalPrice,
        };
        const res = axios.post(`${baseUrl}/order/cod`,orderData)
        // Send order to your backend
        // const response = await axios.post(`${baseUrl}/orders`, orderData);
        // console.log("Order created:", response.data);

        // Redirect to success page or show success message
        // router.push('/order-success');
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      // Handle error (show toast message, etc.)
    } finally {
      setLoading(false);
    }
  };

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

  const subtotal = totalPrice;
  const tax = subtotal * 0.08;
  const discount = discountAmount;
  const finalPrice = subtotal + tax + shippingCost - discount;

  const fetchData = async () => {
    try {
      // Check if cart has items
      if (!cart || cart.length === 0) {
        setProducts([]);
        setTotalPrice(0);
        setDiscountAm(0);
        setDataLoaded(true);
        return;
      }

      const res = await axios.get(`${baseUrl}/products`);
      const allProducts = res.data.products;

      const cartProducts = allProducts.filter((product) =>
        cart.some((cartItem) => cartItem.id === product._id)
      );
      
      const productsWithQuantity = cartProducts.map((p) => {
        const cartItem = cart.find((c) => c.id === p._id);
        return { 
          ...p, 
          quantity: cartItem?.quantity || 1 
        };
      });

      setProducts(productsWithQuantity);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setDataLoaded(true);
    }
  };

  const calculateTotal = () => {
    if (products.length === 0) {
      setTotalPrice(0);
      setDiscountAm(0);
      return;
    }

    const { total, discountAmount } = products.reduce(
      (acc, product) => {
        const { price } = getWholesaleTier(product, product.quantity);
        const itemDiscount = (price * (product.discountPercent || 0)) / 100;
        const itemTotal = price * product.quantity;

        acc.total += itemTotal;
        acc.discountAmount += itemDiscount * product.quantity;

        return acc;
      },
      { total: 0, discountAmount: 0 }
    );

    setTotalPrice(total);
    setDiscountAm(discountAmount);
  };

  // Fetch products when cart changes
  useEffect(() => {
    fetchData();
  }, [cart]); // Add cart as dependency

  // Calculate totals when products change
  useEffect(() => {
    calculateTotal();
  }, [products]); // Add products as dependency

  // Get selected district and upozila names for display
  const selectedDistrictName = districts.find(
    (d) => d._id === watchDistrict
  )?.name;
  const selectedUpozilaName = upozilas.find(
    (u) => u._id === watchUpozila
  )?.name;

  // Show loading state
  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Please add some products to your cart before checkout.</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-3">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-4"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your purchase with secure checkout
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("firstName", {
                        required: "First name is required",
                      })}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        errors.firstName ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        errors.lastName ? "border-red-300" : "border-gray-200"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        errors.email ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      {...register("address", {
                        required: "Address is required",
                      })}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        errors.address ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="House #123, Street Name"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, Suite, etc. (Optional)
                    </label>
                    <input
                      type="text"
                      {...register("apartment")}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <select
                        {...register("district", {
                          required: "District is required",
                        })}
                        onChange={handleDistrictChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                          errors.district ? "border-red-300" : "border-gray-200"
                        }`}
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district._id} value={district._id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.district.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upozila/Thana *
                      </label>
                      <select
                        {...register("upozila", {
                          required: "Upozila is required",
                        })}
                        onChange={handleUpozilaChange}
                        disabled={!watchDistrict}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                          errors.upozila ? "border-red-300" : "border-gray-200"
                        } ${
                          !watchDistrict ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <option value="">Select Upozila</option>
                        {upozilas.map((upozila) => (
                          <option key={upozila._id} value={upozila._id}>
                            {upozila.name}
                          </option>
                        ))}
                      </select>
                      {errors.upozila && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.upozila.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        {...register("city", { required: "City is required" })}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                          errors.city ? "border-red-300" : "border-gray-200"
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\+?[\d\s-()]+$/,
                          message: "Invalid phone number",
                        },
                      })}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 ${
                        errors.phone ? "border-red-300" : "border-gray-200"
                      }`}
                      placeholder="+880 1XXX-XXXXXX"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Cost Display */}
                {shippingCost > 0 && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <svg
                            className="w-5 h-5 text-green-600"
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
                        <div>
                          <p className="font-medium text-green-900">
                            Shipping Available
                          </p>
                          <p className="text-sm text-green-700">
                            Delivery to {selectedDistrictName},{" "}
                            {selectedUpozilaName}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Delivery Time:{" "}
                            {upozilas.find((u) => u._id === watchUpozila)
                              ?.deliveryTime || "2-3 days"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-900">
                          ৳{shippingCost}
                        </p>
                        <p className="text-sm text-green-700">Shipping cost</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* COD Availability Notice */}
                {watchUpozila &&
                  upozilas.find((u) => u._id === watchUpozila)?.codAvailable ===
                    false && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <svg
                            className="w-5 h-5 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-yellow-900">
                            Cash on Delivery Not Available
                          </p>
                          <p className="text-sm text-yellow-700">
                            Cash on Delivery is not available in{" "}
                            {selectedUpozilaName}. Please use online payment.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Payment Method
                </h2>

                <div className="space-y-4">
                  {/* Cash on Delivery - Only show if available */}
                  {(!watchUpozila ||
                    upozilas.find((u) => u._id === watchUpozila)
                      ?.codAvailable !== false) && (
                    <div
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        paymentMethod === "cashOnDelivery"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => setPaymentMethod("cashOnDelivery")}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="radio"
                          {...register("paymentMethod")}
                          value="cashOnDelivery"
                          checked={paymentMethod === "cashOnDelivery"}
                          onChange={() => setPaymentMethod("cashOnDelivery")}
                          className="w-5 h-5 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex items-center gap-3 flex-1">
                          <div className="p-3 bg-green-100 rounded-lg">
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
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900">
                              Cash on Delivery
                            </p>
                            <p className="text-gray-600 mt-1">
                              Pay when you receive your order
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SSL Commerce - Always available */}
                  <div
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      paymentMethod === "sslCommerce"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                    onClick={() => setPaymentMethod("sslCommerce")}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value="sslCommerce"
                        checked={paymentMethod === "sslCommerce"}
                        onChange={() => setPaymentMethod("sslCommerce")}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <svg
                            className="w-6 h-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">
                            SSL Commerce
                          </p>
                          <p className="text-gray-600 mt-1">
                            Pay securely with your credit/debit card
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                              </svg>
                              Secure Payment
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                              SSL Encrypted
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-6">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  {/* Products */}
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                    {products.map((product) => {
                      const { price } = getWholesaleTier(product, product.quantity);
                      return (
                        <div
                          key={product._id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="relative">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                              {product.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ৳{(price * product.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 py-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal(
                        {cart.reduce((total, item) => total + item.quantity, 0)}{" "})</span>
                      <span className="font-medium text-gray-900">
                        ৳{totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">
                        -৳{discountAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">
                        {shippingCost > 0 ? `৳${shippingCost}` : "Calculated"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tax estimate</span>
                      <span className="font-medium text-gray-900">
                        ৳{tax.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <hr className="my-4 border-gray-200" />

                  {/* Total */}
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-50 to-emerald-50 -mx-6 px-6 rounded-lg">
                    <div>
                      <span className="text-lg font-semibold text-gray-900 block">
                        Total
                      </span>
                      <span className="text-sm text-gray-500">
                        Including ৳{tax.toFixed(2)} tax
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600 block">
                        ৳{finalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">BDT</span>
                    </div>
                  </div>

                  {/* Enhanced Security Section */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg
                          className="w-5 h-5 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        Secure Checkout
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
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
                        Your personal information is protected with SSL
                        encryption
                      </p>
                      <p className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
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
                        {paymentMethod === "cashOnDelivery"
                          ? "No payment required until you receive your order"
                          : "Secure payment processing through SSL Commerce"}
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Processing..."
                      : paymentMethod === "cashOnDelivery"
                      ? "Complete Order Securely"
                      : "Proceed to Secure Payment"}
                  </button>

                  {/* Security Notice */}
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      256-bit SSL Encrypted Connection
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
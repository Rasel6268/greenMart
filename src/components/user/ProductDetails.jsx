'use client'
import Image from "next/image";
import Link from "next/link";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaStar, FaShoppingCart, FaShare } from "react-icons/fa";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCart } from "@/hooks/useCart";

export default function ProductDetails({ id }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const {handleAddToCart} = useCart()
 
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async() => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
      return res.data?.product || res.data?.data
    },
    enabled: !!id 
  });
  const convertQyt = Number(quantity)
  

  
  const productData = product || {
    name: "iPhone 16 Pro Max",
    sku: "IP16PM-256-JP",
    brand: "Apple",
    description: "The iPhone 16 Pro Max represents the pinnacle of smartphone technology with its revolutionary design and cutting-edge features. Experience unparalleled performance with the advanced A18 Pro chip and immerse yourself in the stunning Super Retina XDR OLED display.",
    images: ["/iphone.png", "/iphone.png", "/iphone.png"],
    retailPrice: 35,
    regularPrice: 45,
    stock: 150,
    importOrigin: "Japan",
    rating: 4.8,
    reviewCount: 766,
    wholesalePricing: [
      { minQty: 1, maxQty: 4, price: 35, label: "Retail", unit: "per item" },
      { minQty: 5, maxQty: 9, price: 32, label: "Small Bulk", unit: "per item", discount: true },
      { minQty: 10, maxQty: 24, price: 30, label: "Medium Bulk", unit: "per item", discount: true },
      { minQty: 25, maxQty: 49, price: 28, label: "Large Bulk", unit: "per item", discount: true },
      { minQty: 50, maxQty: 99, price: 25, label: "Wholesale", unit: "per item", discount: true },
      { minQty: 100, maxQty: null, price: 22, label: "Premium Wholesale", unit: "per item", discount: true },
    ],
    isDiscountActive: true,
    discountPercent: 22,
    isFeatured: true,
    isNewArrival: true,
    isTopSeller: true
  };

 
  const productImages = productData.images.map((src, index) => ({
    src: src,
    label: ["Front View", "Back View", "Side View", "Detail View", "Package View"][index] || `Image ${index + 1}`
  }));

  const scrollImages = (direction) => {
    const container = document.getElementById('imageThumbnails');
    if (container) {
      const scrollAmount = 100;
      container.scrollBy({
        top: direction === 'down' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Calculate current price based on quantity using product's wholesale pricing
  const getCurrentPrice = (qty) => {
    if (!productData.wholesalePricing || productData.wholesalePricing.length === 0) {
      return productData.retailPrice;
    }
    
    const tier = productData.wholesalePricing.find(tier => 
      tier.maxQty ? (qty >= tier.minQty && qty <= tier.maxQty) : qty >= tier.minQty
    );
    return tier ? tier.price : productData.wholesalePricing[0].price;
  };

  const currentPrice = getCurrentPrice(quantity);
  const regularPrice = productData.regularPrice || productData.retailPrice;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <div className="bg-gray-200 rounded-2xl h-96"></div>
              </div>
              <div className="lg:col-span-6">
                <div className="bg-gray-200 rounded-2xl h-96"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h2>
            <p className="text-red-500 mb-4">There was an error loading the product.</p>
            <Link href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/electronics" className="hover:text-green-600 transition-colors">Electronics</Link>
          <span className="mx-2">/</span>
          <Link href="/smartphones" className="hover:text-green-600 transition-colors">Smartphones</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{productData.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side - Product Images with Vertical Thumbnails */}
          <div className="lg:col-span-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Vertical Thumbnails */}
              <div className="flex lg:flex-col order-2 lg:order-1">
                <div
                  id="imageThumbnails"
                  className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[400px] no-scrollbar scroll-smooth p-1"
                >
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 border-2 rounded-xl p-2 transition-all duration-300 hover:border-green-500 ${
                        selectedImage === index 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image.src}
                        width={80}
                        height={80}
                        alt={image.label}
                        className="rounded-lg object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Image */}
              <div className="flex-1 order-1 lg:order-2">
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-square flex items-center justify-center">
                    <Image
                      src={productImages[selectedImage]?.src || "/placeholder-image.jpg"}
                      alt={productData.name}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {productData.isDiscountActive && productData.discountPercent > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          -{productData.discountPercent}% OFF
                        </span>
                      )}
                      {productData.isNewArrival && (
                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                      {productData.isTopSeller && (
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          TOP SELLER
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
              <div className="text-gray-600 text-sm leading-relaxed space-y-2">
                <p>{productData.description}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Product Details */}
          <div className="lg:col-span-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-6">
              {/* Header with Wishlist and Share */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                    {productData.name}
                  </h1>
                  <p className="text-green-600 text-sm font-medium mt-1 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${productData.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {productData.importOrigin ? `Imported From ${productData.importOrigin} • ` : ''}
                    {productData.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-xl border transition-all duration-300 ${
                      isWishlisted 
                        ? 'bg-red-50 border-red-200 text-red-500' 
                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-red-500'
                    }`}
                  >
                    {isWishlisted ? <AiFillHeart className="text-xl" /> : <AiOutlineHeart className="text-xl" />}
                  </button>
                  <button className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:text-green-600 transition-colors">
                    <FaShare className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-6 text-sm text-gray-700 space-y-2">
                <div className="flex gap-6">
                  <span><span className="font-semibold">Brand:</span> {productData.brand || 'N/A'}</span>
                </div>
                <div className="flex gap-6">
                  <span><span className="font-semibold">SKU:</span> {productData.sku}</span>
                </div>
                <div className="flex gap-6">
                  <span><span className="font-semibold">Category:</span> {productData.category}</span>
                </div>
              </div>

              {/* Wholesale Pricing Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Wholesale Pricing</h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {productData.wholesalePricing?.map((tier, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          quantity >= tier.minQty && (tier.maxQty ? quantity <= tier.maxQty : true)
                            ? 'border-green-500 bg-green-50 shadow-sm transform scale-105'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-gray-600">{tier.label}</span>
                          {tier.discount && (
                            <span className="bg-green-100 text-green-600 text-xs px-1 rounded">Save</span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-800">${tier.price}</span>
                          <span className="text-xs text-gray-500">{tier.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tier.maxQty 
                            ? `${tier.minQty}-${tier.maxQty} items`
                            : `${tier.minQty}+ items`
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Current Price Display */}
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-600">Your Price for {quantity} item{quantity > 1 ? 's' : ''}:</span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-2xl font-bold text-green-600">${currentPrice}</span>
                          <span className="text-sm text-gray-500">per item</span>
                          {currentPrice < regularPrice && (
                            <span className="text-sm line-through text-gray-400">${regularPrice}</span>
                          )}
                        </div>
                      </div>
                      {currentPrice < regularPrice && (
                        <div className="text-right">
                          <span className="bg-green-100 text-green-600 text-sm font-semibold px-2 py-1 rounded">
                            Save ${(regularPrice - currentPrice) * quantity}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.round((1 - currentPrice/regularPrice) * 100)}% off
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-6">
                <p className="text-gray-600 font-medium mb-3">Quantity:</p>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                    disabled={productData.stock > 0 && quantity >= productData.stock}
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-500 ml-2">
                    Total: <span className="font-semibold text-green-600">${(quantity * currentPrice).toLocaleString()}</span>
                  </span>
                </div>
                
                {/* Stock Information */}
                <div className="mt-2 text-xs text-gray-500">
                  {productData.stock > 0 ? (
                    <span>{productData.stock} units available</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </div>
                
                {/* Quantity Tips */}
                <div className="mt-3 text-xs text-gray-500 space-y-1">
                  {quantity < 5 && productData.wholesalePricing?.[1] && (
                    <p>🔹 Buy {productData.wholesalePricing[1].minQty}+ items to unlock wholesale pricing at ${productData.wholesalePricing[1].price} per item</p>
                  )}
                  {quantity >= 5 && quantity < 10 && productData.wholesalePricing?.[2] && (
                    <p>🎯 Great! You're saving ${(regularPrice - currentPrice) * quantity}. Buy 10+ items for even better pricing at ${productData.wholesalePricing[2].price} per item</p>
                  )}
                  {quantity >= 10 && (
                    <p>✅ Excellent choice! You're getting the best wholesale price.</p>
                  )}
                </div>
              </div>

              {/* Ratings */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < Math.floor(productData.rating) ? "text-yellow-500" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 font-semibold">{productData.rating}/5</span>
                <span className="text-sm text-gray-500">({productData.reviewCount} Reviews)</span>
                <Link
                  href="#reviews"
                  className="underline text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  See Reviews
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/checkout"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    if (productData.stock === 0) {
                      e.preventDefault();
                    }
                  }}
                >
                  <FaShoppingCart />
                  {productData.stock > 0 ? 'Buy Now' : 'Out of Stock'}
                </Link>
                 <button
                onClick={() => handleAddToCart(productData._id,convertQyt,productData.name)}
                  className="flex-1 border-2 border-green-600 cursor-pointer text-green-600 hover:bg-green-50 px-6 py-4 rounded-xl font-semibold text-center transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  
                >
                  {productData.stock > 0 ? 'Add To Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
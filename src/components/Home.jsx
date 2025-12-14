"use client";
import React from "react";
import {
  FaStar,
  FaRegHeart,
  FaAngleRight,
  FaShoppingCart,
} from "react-icons/fa";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

import instance from "@/lib/instance";
import BannerSlider from "@/components/BannerSwiper";
import Image from "next/image";
import { useCart } from "@/Hooks/useCart";

const Home = () => {
  const { handleAddToCart } = useCart();
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await instance.get("/products");
      return res.data.products;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await instance.get("/products/count_product");
      return res.data?.data ?? [];
    },
  });
 

  const isNew = products
    ?.filter((product) => product.isNewArrival === true)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 4);

  const [isNew1, isNew2, isNew3, isNew4] = isNew || [];

  const isDiscount = products?.filter((Item) => Item.isDiscountActive === true);

  const isFeatured = products
    ?.filter((product) => product.isFeatured === true)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 4);

  const isTopSeller = products
    ?.filter((product) => product.isTopSeller === true)
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 8);



  return (
    <section className="bg-gray-50">
      {/* Main Banner & Categories Section */}
      <div className="p-4 md:p-8">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-2 lg:block hidden">
              <div className="bg-white rounded-2xl shadow-lg p-6 h-full lg:sticky lg:top-6 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-4">
                  📁 Categories
                </h2>

                <ul className="space-y-3">
                  {categories?.map((category, index) => (
                    <li
                      key={index}
                      className={`flex justify-between items-center rounded-xl px-4 py-3 transition-all duration-300 ${
                        category.active
                          ? "bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                          : "bg-white text-gray-700 shadow-md"
                      }`}
                    >
                      <span className="font-medium">{category.category}</span>
                      <span
                        className={`text-sm font-semibold rounded-full px-2.5 py-1 min-w-8 text-center ${
                          category.active
                            ? "bg-white text-green-600"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {category.totalProducts}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 bg-linear-to-br from-orange-400 to-pink-500 rounded-2xl p-4 text-white text-center shadow-lg">
                  <h3 className="font-bold text-lg">Special Offer! 🎉</h3>
                  <p className="text-sm mt-1">
                    Up to 50% off on selected items
                  </p>
                  <button className="mt-3 bg-white text-orange-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content Section */}
            <div className="lg:col-span-8 space-y-6">
              {/* Banner Slider */}
              <div className="rounded-2xl overflow-hidden">
                <BannerSlider />
              </div>

              {/* Trusted Brands & Top Categories Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 py-5">
                {/* Trusted Brands */}
                <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <span className="text-green-500">🏢</span>
                    Trusted Brands
                  </h1>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      "/download.png",
                      "/chanel-removebg-preview.png",
                      "/dior-removebg-preview.png",
                      "/images-removebg-preview.png",
                      "/puma-removebg-preview.png",
                      "/lg-removebg-preview.png",
                      "/images__1_-removebg-preview.png",
                      "/puma-removebg-preview.png",
                    ].map((brand, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-3 rounded-xl hover:bg-green-50 transition-colors duration-300 flex items-center justify-center"
                      >
                        <Image
                          src={brand}
                          width={32}
                          height={32}
                          className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                          alt="Brand"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl lg:block hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <span className="text-green-500">🏷️</span>
                      Top Categories
                    </h1>
                    <Link
                      href="/shop"
                      className="flex items-center text-green-600 gap-1 font-semibold hover:text-green-700 transition-colors group"
                    >
                      view all
                      <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {[
                      {
                        name: "Toy house",
                        icon: "/toyhouse.png",
                      },
                      {
                        name: "Speaker",
                        icon: "/speaker-removebg-preview.png",
                      },
                      { name: "Watch", icon: "/watch1.png" },
                      {
                        name: "Phones",
                        icon: "/toy_house-removebg-preview.png",
                      },
                      {
                        name: "Laptops",
                        icon: "/speaker-removebg-preview.png",
                      },
                    ].map((category, index) => (
                      <div
                        key={index}
                        className="text-center group cursor-pointer"
                      >
                        <div className="bg-gray-50 rounded-2xl p-3 sm:p-4 hover:bg-green-50 transition-all duration-300 group-hover:scale-105 mb-2">
                          <Image
                            src={category.icon}
                            width={40}
                            height={40}
                            className="w-10 h-10 sm:w-12 sm:h-12 mx-auto object-contain"
                            alt={category.name}
                          />
                        </div>
                        <p className="text-gray-600 text-sm font-medium group-hover:text-green-600 transition-colors line-clamp-1">
                          {category.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="py-12 md:py-16">
        <div className="w-11/12 mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              🔥 Popular Products
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {isFeatured?.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="relative overflow-hidden">
                  <div className="aspect-4/3 w-full">
                    <Image
                      src={item.images?.[0]}
                      alt={item.name}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw,
                   (max-width: 1024px) 50vw,
                   25vw"
                    />
                  </div>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </span>

                    {item.isDiscountActive && (
                      <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{item.discountPercent}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="font-bold text-gray-800 text-lg line-clamp-1"
                      title={item.name}
                    >
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="hidden md:flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className="text-yellow-400 text-sm"
                        />
                      ))}
                      <span className="text-gray-500 text-sm ml-1">(128)</span>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-bold text-green-600 flex items-center justify-end">
                        <FaBangladeshiTakaSign size={16} />
                        {item.retailPrice}
                      </span>

                      {item.regularPrice &&
                        item.regularPrice !== item.retailPrice && (
                          <span className="text-sm line-through text-gray-500 ml-2 block">
                            {item.regularPrice}
                          </span>
                        )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(item._id, 1, item.name);
                    }}
                    disabled={(item.stock || 0) === 0}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                      (item.stock || 0) === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    {(item.stock || 0) === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              View All Popular Products
              <FaAngleRight />
            </Link>
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="py-12 md:py-16">
        <div className="w-11/12 mx-auto px-4">
          {/* Heading */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800">
              <span className="w-3 h-8 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></span>
              New Arrivals
            </h2>
            <Link
              href="/shop"
              className="flex items-center text-green-600 gap-2 font-semibold hover:text-green-700 transition-colors group"
            >
              View All
              <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Big PS5 Card */}
            <div
              className="p-6 md:p-8 relative rounded-2xl flex flex-col justify-between min-h-[400px] md:min-h-[500px] group hover:shadow-2xl transition-all duration-500 overflow-hidden"
              style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(17, 24, 39, 0.40), rgba(0, 0, 0, 0.6)), url(${
                  isNew1?.images?.[1] || isNew1?.images?.[0] || "/ps5.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="text-white relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">
                  {isNew1?.name || "Play Station 5"}
                </h3>
                <p className="text-gray-200 text-base md:text-lg mb-6">
                  {isNew1?.description ||
                    "Black and White version of the PS5 coming out on sale."}
                </p>
                <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Shop Now
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Women Fashion Card */}
              <div
                className="p-6 rounded-2xl relative h-64 overflow-hidden group"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(50, 66, 81, 0.8), rgba(17, 24, 150, 0.7)), url(${
                    isNew2?.images?.[0] || "/women.jpg"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div className="relative max-w-[200px] h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {isNew2?.name || "Women Fashion"}
                  </h3>
                  <p className="text-purple-100 text-sm mb-4">
                    {isNew2?.shortDescription ||
                      "Featured woman collections that give you another vibe."}
                  </p>
                  <Link
                    href="/shop"
                    className="bg-white text-purple-600 px-5 py-2 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 w-fit"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>

              {/* Speakers Row */}
              <div className="flex flex-col sm:flex-row gap-6">
                <div
                  className="p-6 rounded-2xl flex-1 group hover:shadow-xl transition-all duration-500 relative overflow-hidden min-h-[200px] sm:min-h-[250px]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(239, 246, 255, 0.9), rgba(207, 250, 254, 0.9)), url(${
                      isNew3?.images?.[0] || "/speaker-removebg-preview.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <h3 className="font-bold text-gray-800 text-lg">
                    {isNew3?.name || "Wireless Speaker"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {isNew3?.category || "Amazon wireless speakers"}
                  </p>
                  <button className="text-green-600 font-semibold hover:text-green-700 transition-colors">
                    Shop Now →
                  </button>
                </div>
                <div
                  className="p-6 rounded-2xl flex-1 group hover:shadow-xl transition-all duration-500 relative overflow-hidden min-h-[200px] sm:min-h-[250px]"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, rgba(255, 247, 237, 0.9), rgba(254, 215, 226, 0.9)), url(${
                      isNew4?.images?.[0] || "/speaker-removebg-preview.png"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <h3 className="font-bold text-gray-800 text-lg">
                    {isNew4?.name || "Bluetooth Speaker"}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {isNew4?.category || "Premium sound quality"}
                  </p>
                  <Link
                    href="/shop"
                    className="text-green-600 font-semibold hover:text-green-700 transition-colors"
                  >
                    Shop Now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Sells and Top Ratings Section */}
      <div className="py-12 md:py-16">
        <div className="w-11/12 mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800 mb-8">
            <span className="w-3 h-8 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></span>
            Best selling product
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isTopSeller?.map((product, index) => (
              <Link href={`/product_details/${product._id}`}>
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="relative">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-lg font-bold text-gray-800 line-clamp-1">
                        {product.name}
                      </h2>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className="text-yellow-400 text-sm"
                          />
                        ))}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-green-600 flex items-center">
                          <FaBangladeshiTakaSign size={16} />
                          {product.retailPrice}
                        </span>
                        {product.regularPrice &&
                          product.regularPrice !== product.retailPrice && (
                            <span className="text-sm line-through text-gray-500 ml-2">
                              {product.regularPrice}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product._id, 1, product.name);
                        }}
                        disabled={(product.stock || 0) === 0}
                        className={`flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer ${
                          (product.stock || 0) === 0
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-linear-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5"
                        }`}
                      >
                        <FaShoppingCart />
                        Add to cart
                      </button>

                      <button className="flex-1 bg-white text-green-600 border border-green-600 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center justify-center">
                        <FaRegHeart />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Discount Products Section */}
      <div className="py-12 md:py-16">
        <div className="w-11/12 mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800">
              <span className="w-3 h-8 bg-linear-to-b from-green-500 to-emerald-600 rounded-full"></span>
              Discount Products (2-20% OFF)
            </h2>
            <Link
              href="/shop"
              className="flex items-center text-green-600 gap-2 font-semibold hover:text-green-700 transition-colors group"
            >
              View All
              <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {isDiscount?.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
              >
                <Link
                  href={`/product_details/${product._id}`}
                  className="block"
                >
                  <div className="relative">
                    <img
                      src={product.images?.[0] || "/placeholder-product.png"}
                      alt={product.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.png";
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{product.discountPercent}%
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-base font-bold text-gray-800 line-clamp-1">
                        {product.name}
                      </h2>
                      <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to wishlist logic
                        }}
                      >
                        <FaRegHeart className="text-lg" />
                      </button>
                    </div>

                    <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar
                            key={star}
                            className="text-yellow-400 text-xs"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-green-600 flex items-center">
                        <FaBangladeshiTakaSign size={14} />
                        {product.retailPrice}
                      </span>
                      <span className="text-xs line-through text-gray-500">
                        {product.regularPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;

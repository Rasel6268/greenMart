import React from "react";
import { FaStar, FaRegHeart, FaAngleRight, FaChevronLeft, FaChevronRight, FaShoppingCart, FaEye } from "react-icons/fa";
import Link from "next/link";

export const metadata = {
  title: "Home page",
};

const Page = () => {
  return (
    <section className="bg-gray-50">
      {/* banner section */}
      <div className="bg-gradient-to-r from-green-50 to-gray-100 p-8">
        <div className="flex gap-6 items-start max-w-7xl mx-auto">
          {/* sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 w-80 h-[730px] sticky top-6 transition-all duration-300 hover:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-4">
              📁 Categories
            </h2>

            <ul className="space-y-3">
              {[
                { name: "Mobile Accessories", count: 10, active: true },
                { name: "Women's Fashion", count: 200 },
                { name: "Men's Fashion", count: 100 },
                { name: "Smart Watch", count: 150 },
                { name: "Sports", count: 80 },
                { name: "Travel", count: 30 },
                { name: "Toys", count: 100 },
              ].map((category, index) => (
                <li key={index}>
                  <a
                    href={`#${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`flex justify-between items-center rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 ${
                      category.active 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg transform -translate-y-0.5" 
                        : "bg-white text-gray-700 shadow-md hover:shadow-lg hover:bg-green-50 hover:transform hover:-translate-y-0.5"
                    }`}
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className={`text-sm font-semibold rounded-full px-2.5 py-1 min-w-8 text-center ${
                      category.active 
                        ? "bg-white text-green-600" 
                        : "bg-green-500 text-white"
                    }`}>
                      {category.count}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Special Offer Banner */}
            <div className="mt-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl p-4 text-white text-center shadow-lg">
              <h3 className="font-bold text-lg">Special Offer! 🎉</h3>
              <p className="text-sm mt-1">Up to 50% off on selected items</p>
              <button className="mt-3 bg-white text-orange-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
            </div>
          </div>

          {/* Banner Content */}
          <div className="flex-1 space-y-6">
            {/* Main Banner */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&w=1200&q=80"
                alt="Shopping experience"
                className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
                <div className="text-white p-12 max-w-lg">
                  <h1 className="text-5xl font-bold mb-4">Summer Sale</h1>
                  <p className="text-xl mb-6 opacity-90">Discover amazing deals on your favorite products</p>
                  <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>

            {/* Trusted Brands & Top Categories */}
            <div className="flex gap-6">
              {/* Trusted Brands */}
              <div className="bg-white w-1/2 h-[280px] rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
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
                    "/puma-removebg-preview.png"
                  ].map((brand, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-xl hover:bg-green-50 transition-colors duration-300 flex items-center justify-center">
                      <img src={brand} className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300" alt="Brand" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Categories */}
              <div className="bg-white w-1/2 h-[280px] rounded-2xl shadow-xl p-6 transition-all duration-300 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-green-500">🏷️</span>
                    Top Categories
                  </h1>
                  <Link href="/categories" className="flex items-center text-green-600 gap-1 font-semibold hover:text-green-700 transition-colors group">
                    view all
                    <FaAngleRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                <div className="grid grid-cols-5 gap-4">
                  {[
                    { name: "Toy house", icon: "/toy_house-removebg-preview.png" },
                    { name: "Speaker", icon: "/speaker-removebg-preview.png" },
                    { name: "Watch", icon: "/watch1.png" },
                    { name: "Phones", icon: "/toy_house-removebg-preview.png" },
                    { name: "Laptops", icon: "/speaker-removebg-preview.png" },
                  ].map((category, index) => (
                    <div key={index} className="text-center group cursor-pointer">
                      <div className="bg-gray-50 rounded-2xl p-4 hover:bg-green-50 transition-all duration-300 group-hover:scale-110 mb-2">
                        <img src={category.icon} className="w-12 h-12 mx-auto object-contain" alt={category.name} />
                      </div>
                      <p className="text-gray-600 text-sm font-medium group-hover:text-green-600 transition-colors">{category.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🔥 Popular Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our most loved items that customers can't stop talking about
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group">
                <div className="relative overflow-hidden">
                  <img
                    src="/watch1.png"
                    alt="Popular Product"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      HOT
                    </span>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -30%
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <button className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-green-600 p-3 rounded-full shadow-lg hover:bg-green-600 hover:text-white">
                      <FaEye />
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">Premium Smart Watch</h3>
                    <button className="text-gray-400 hover:text-red-500 transition-colors">
                      <FaRegHeart className="text-xl" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Advanced features with heart rate monitoring and GPS tracking
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar key={star} className="text-yellow-400 text-sm" />
                      ))}
                      <span className="text-gray-500 text-sm ml-1">(128)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">$299</span>
                      <span className="text-sm line-through text-gray-500 ml-2 block">$399</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/popular-products" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-3 rounded-full font-semibold hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-105">
              View All Popular Products
              <FaAngleRight />
            </Link>
          </div>
        </div>
      </div>

      {/* best selling products */}
      <div className="relative py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              🏆 Best Selling Products
            </h2>
            <p className="text-gray-600 text-lg">Products loved by thousands of customers</p>
          </div>

          {/* Navigation Arrows */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-2xl border text-gray-600 hover:text-green-600 hover:border-green-600 p-4 rounded-full z-10 transition-all duration-300 hover:scale-110">
            <FaChevronLeft />
          </button>

          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-2xl border text-gray-600 hover:text-green-600 hover:border-green-600 p-4 rounded-full z-10 transition-all duration-300 hover:scale-110">
            <FaChevronRight />
          </button>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((product) => (
              <div key={product} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
                <Link href="/product-details" className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src="/watch1.png"
                      alt="Product"
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-full shadow-md transition-colors">
                        <FaRegHeart className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                        Black Leather Watch
                      </h2>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      Premium leather watch with advanced features and elegant design.
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} className="text-yellow-400 text-sm" />
                        ))}
                      </div>
                      <div>
                        <span className="text-xl font-bold text-green-600">$4.99</span>
                        <span className="text-sm line-through text-gray-500 ml-2">$6.99</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2">
                  <FaShoppingCart />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue with the rest of your existing sections (new arrivals, top sells, etc.) */}
      {/* ... rest of your existing code ... */}

    </section>
  );
};

export default Page;
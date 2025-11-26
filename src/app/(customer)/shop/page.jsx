"use client";
import { useCart } from "@/Hooks/useCart";
import instance from "@/lib/instance";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { toast } from "react-toastify";

const Shop = () => {
  const { addToCart, handleAddToCart } = useCart();

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const res = await instance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/count_product`
        );
        return res.data?.data ?? [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
    },
  });

  const {
    data: brand,
    isLoading: brandsLoading,
    error: brandsError,
  } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      try {
        const res = await instance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products/brandWithProductCount`
        );
        return res.data?.data ?? [];
      } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
      }
    },
  });

  const {
    data: initialProducts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await instance.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`
        );
        return res.data?.products ?? [];
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    },
  });

  const filtersData = {
    priceRanges: [
      { id: 1, range: "$0 - $25", min: 0, max: 25, count: 15 },
      { id: 2, range: "$25 - $50", min: 25, max: 50, count: 23 },
      { id: 3, range: "$50 - $100", min: 50, max: 100, count: 31 },
      { id: 4, range: "$100+", min: 100, max: 1000, count: 12 },
    ],
    brands: brand || [],
    ratings: [
      { id: 1, stars: 5, count: 25 },
      { id: 2, stars: 4, count: 30 },
      { id: 3, stars: 3, count: 18 },
      { id: 4, stars: 2, count: 5 },
      { id: 5, stars: 1, count: 2 },
    ],
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [priceSort, setPriceSort] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter products with proper error handling
  const filteredProducts = useMemo(() => {
    let filtered = initialProducts || [];

    // Search filter with safe access
    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const searchLower = searchTerm.toLowerCase();
        return (
          product?.name?.toLowerCase().includes(searchLower) ||
          product?.category?.toLowerCase().includes(searchLower) ||
          product?.brand?.toLowerCase().includes(searchLower) ||
          product?.tags?.some((tag) =>
            tag?.toLowerCase().includes(searchLower)
          ) ||
          false
        );
      });
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (product) =>
          product?.category && selectedCategories.includes(product.category)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(
        (product) => product?.brand && selectedBrands.includes(product.brand)
      );
    }

    // Price range filter
    if (selectedPriceRanges.length > 0) {
      filtered = filtered.filter((product) => {
        return selectedPriceRanges.some((rangeId) => {
          const range = filtersData.priceRanges.find((r) => r.id === rangeId);
          return product?.price >= range.min && product?.price <= range.max;
        });
      });
    }

    // Rating filter - fixed logic
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((product) => {
        const productRating = Math.round(product?.rating || 0);
        return selectedRatings.includes(productRating);
      });
    }

    // Price sorting
    if (priceSort === "low-to-high") {
      filtered = [...filtered].sort(
        (a, b) => (a?.price || 0) - (b?.price || 0)
      );
    } else if (priceSort === "high-to-low") {
      filtered = [...filtered].sort(
        (a, b) => (b?.price || 0) - (a?.price || 0)
      );
    }

    return filtered;
  }, [
    searchTerm,
    selectedCategories,
    selectedBrands,
    selectedPriceRanges,
    selectedRatings,
    priceSort,
    initialProducts,
    filtersData.priceRanges,
  ]);

  // Handler functions
  const handleCategoryToggle = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleBrandToggle = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  };

  const handlePriceRangeToggle = (rangeId) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId)
        ? prev.filter((r) => r !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };
  // const handleAddToCart = (productId, quentity, productName) => {
  //   const result = addToCart(productId, quentity);
  //   console.log(result);
  //   if (result.success == false) {
  //     toast.info(result.message);
  //   } else if (result.success == true) {
  //     toast.success(`${productName} added to cart!`);
  //   }
  // };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRanges([]);
    setSelectedRatings([]);
    setPriceSort("");
    setSearchTerm("");
  };

  const getActiveFiltersCount = () => {
    return (
      selectedCategories.length +
      selectedBrands.length +
      selectedPriceRanges.length +
      selectedRatings.length +
      (priceSort ? 1 : 0)
    );
  };

 

  // Add loading state
  if (isLoading || categoriesLoading || brandsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  // Add error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600 text-lg">
          Error loading products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-11/12 mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {/* Price Sort Radio */}
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
                <label className="text-sm text-gray-600 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value)}
                  className="border-none focus:ring-0 text-sm"
                >
                  <option value="">Featured</option>
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>

              {/* Clear Filters */}
              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-red-600 hover:text-red-700 whitespace-nowrap"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Filters Sidebar */}
          <div
            className={`lg:col-span-1 ${
              isFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white shadow-lg rounded-lg sticky top-6">
              {/* Filters Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Filters
                  </h2>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()} active
                    </span>
                  )}
                </div>
              </div>

              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {/* Categories */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    <span>Categories</span>
                    <span className="text-xs text-gray-500">
                      {selectedCategories.length} selected
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {categories?.map((category, index) => (
                      <label
                        key={category.category || index}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(
                              category.category
                            )}
                            onChange={() =>
                              handleCategoryToggle(category.category)
                            }
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 group-hover:text-blue-600">
                            {category.category}
                          </span>
                        </div>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-600">
                          {category.totalProducts || 0}
                        </span>
                      </label>
                    ))}
                    {(!categories || categories.length === 0) && (
                      <p className="text-gray-500 text-sm">
                        No categories available
                      </p>
                    )}
                  </div>
                </div>
                {/* Brands */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3 flex items-center justify-between">
                    <span>Brands</span>
                    <span className="text-xs text-gray-500">
                      {selectedBrands.length} selected
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {filtersData.brands?.map((brandItem, index) => (
                      <label
                        key={brandItem.brand || index}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brandItem.brand)}
                            onChange={() => handleBrandToggle(brandItem.brand)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 group-hover:text-blue-600">
                            {brandItem.brand}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          ({brandItem.totalProducts || 0})
                        </span>
                      </label>
                    ))}
                    {(!filtersData.brands ||
                      filtersData.brands.length === 0) && (
                      <p className="text-gray-500 text-sm">
                        No brands available
                      </p>
                    )}
                  </div>
                </div>

                {/* Price Range */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    {filtersData.priceRanges.map((range) => (
                      <label
                        key={range.id}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range.id)}
                            onChange={() => handlePriceRangeToggle(range.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700 group-hover:text-blue-600">
                            {range.range}
                          </span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          ({range.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings Filter */}
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-3">Ratings</h3>
                  <div className="space-y-2">
                    {filtersData.ratings.map((rating) => (
                      <label
                        key={rating.id}
                        className="flex items-center justify-between group cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating.stars)}
                            onChange={() => handleRatingToggle(rating.stars)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < rating.stars
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-500 text-xs">
                          ({rating.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Clear Filters Button */}
              {getActiveFiltersCount() > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-5">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  All Products
                </h1>
                <p className="text-gray-600">
                  Showing {filteredProducts?.length || 0} of{" "}
                  {initialProducts?.length || 0} products
                </p>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts?.map((product) => (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                  >
                    <Link href={`/product_details/${product._id}`}>
                      {/* Product Image Container */}
                      <div className="relative overflow-hidden bg-gray-50">
                        <img
                          src={
                            product.images?.[0] ||
                            "/images/placeholder-product.jpg"
                          }
                          alt={product.name || "Product image"}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                          
                        />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {product.isNewArrival && (
                            <span className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                              New
                            </span>
                          )}
                          {product.isDiscountActive && (
                            <span className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                              -{product.discountPercent}%
                            </span>
                          )}
                          {product.isFeatured && (
                            <span className="bg-purple-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                              Featured
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="bg-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                              Bestseller
                            </span>
                          )}
                        </div>

                        {/* Quick Action Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-xl">
                            Quick View
                          </button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {/* Brand and Category */}
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                            {product.brand || "Generic"}
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {product.category || "Uncategorized"}
                          </span>
                        </div>

                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors duration-200 text-lg leading-tight">
                          {product.name || "Unnamed Product"}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-sm ${
                                    i < Math.floor(product.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  } ${
                                    i < (product.rating || 0)
                                      ? "drop-shadow-sm"
                                      : ""
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                              <span className="text-sm font-medium text-gray-700 ml-1.5">
                                {product.rating || 0}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({product.reviewCount || 0} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              ${product.retailPrice || 0}
                            </span>
                            {product.regularPrice &&
                              product.regularPrice > product.retailPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${product.regularPrice}
                                </span>
                              )}
                          </div>

                          {/* Stock Status */}
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              (product.stock || 0) > 10
                                ? "text-green-600 bg-green-50"
                                : (product.stock || 0) > 0
                                ? "text-orange-600 bg-orange-50"
                                : "text-red-600 bg-red-50"
                            }`}
                          >
                            {(product.stock || 0) > 10
                              ? "In Stock"
                              : (product.stock || 0) > 0
                              ? "Low Stock"
                              : "Out of Stock"}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product._id, 1, product.name);
                          }}
                          disabled={(product.stock || 0) === 0}
                          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                            (product.stock || 0) === 0
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
                          {(product.stock || 0) === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="max-w-md mx-auto">
                  {/* Animated Icon */}
                  <div className="relative mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-12 h-12 text-gray-400 animate-bounce"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-200 rounded-full animate-ping"></div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                    We couldn't find any products matching your criteria. Try
                    adjusting your search terms or filters.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={clearAllFilters}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
                    >
                      Clear All Filters
                    </button>
                    <button
                      onClick={() => (window.location.href = "/")}
                      className="border border-gray-300 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;

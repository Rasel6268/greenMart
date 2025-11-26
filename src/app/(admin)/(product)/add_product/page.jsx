// components/AddProduct.jsx
"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  X,
  Upload,
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import useImageUpload from "@/hooks/useImageUpload";

const AddProduct = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {uploadImages, imageHandler} = useImageUpload()
  const base_url = process.env.NEXT_PUBLIC_API_URL

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    brand: "",
    stock: 0,
    retailPrice: 0,
    regularPrice: 0,
    wholesalePrice: 0,
    discountPercent: 0,
    isDiscountActive: false,
    isFeatured: false,
    isNewArrival: false,
    isTopSeller: false,
    status: "active",
    importOrigin: "",
    rating: 0,
    reviewCount: 0,
    wholesalePricing: [
      { minQty: 1, maxQty: 4, price: 0, label: "Retail", unit: "per item", discount: false },
      { minQty: 5, maxQty: 9, price: 0, label: "Small Bulk", unit: "per item", discount: true },
      { minQty: 10, maxQty: 24, price: 0, label: "Medium Bulk", unit: "per item", discount: true },
      { minQty: 25, maxQty: 49, price: 0, label: "Large Bulk", unit: "per item", discount: true },
      { minQty: 50, maxQty: 99, price: 0, label: "Wholesale", unit: "per item", discount: true },
      { minQty: 100, maxQty: null, price: 0, label: "Premium Wholesale", unit: "per item", discount: true },
    ]
  });

  // Categories and brands
  const {data: categories} = useQuery({
    queryKey: ['categories'],
    queryFn: async() => {
      const res = await axios.get(`${base_url}/categories`)
      return res.data.data
    }
  })

  const {data: brands} = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
     const res = await axios.get(`${base_url}/brands`)
     return res.data.data
    }
  })

  const createProductMutation = useMutation({
    mutationFn: async(productData) => {
      const res = await axios.post(`${base_url}/products`, productData)
      return res.data
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      router.push("/products");
    }
  })

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : parseFloat(value),
    }));
  };

  // Handle wholesale pricing changes
  const handleWholesalePricingChange = (index, field, value) => {
    const updatedPricing = [...formData.wholesalePricing];
    
    if (field === 'price' || field === 'minQty' || field === 'maxQty') {
      value = value === "" ? 0 : parseFloat(value);
    }
    
    if (field === 'maxQty' && value === 0) {
      value = null; // Set to null for unlimited
    }
    
    updatedPricing[index] = {
      ...updatedPricing[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      wholesalePricing: updatedPricing
    }));
  };

  // Add new wholesale tier
  const addWholesaleTier = () => {
    setFormData(prev => ({
      ...prev,
      wholesalePricing: [
        ...prev.wholesalePricing,
        { minQty: 1, maxQty: null, price: 0, label: "New Tier", unit: "per item", discount: true }
      ]
    }));
  };

  // Remove wholesale tier
  const removeWholesaleTier = (index) => {
    if (formData.wholesalePricing.length <= 1) return;
    
    setFormData(prev => ({
      ...prev,
      wholesalePricing: prev.wholesalePricing.filter((_, i) => i !== index)
    }));
  };

  const addCancel = () => {
    if (confirm("Any unsaved changes will be lost. Are you sure you want to cancel?")) {
      router.push("/products");
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Generate SKU automatically
  const generateSKU = () => {
    const prefix = formData.category
      ? formData.category.substring(0, 3).toUpperCase()
      : "PRO";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const sku = `${prefix}-${random}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  // Form validation
  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.sku.trim()) errors.push("SKU is required");
    if (!formData.category) errors.push("Category is required");
    if (formData.retailPrice <= 0) errors.push("Retail price must be greater than 0");
    if (formData.stock < 0) errors.push("Stock cannot be negative");
    if (uploadImages.length === 0) errors.push("At least one image is required");

    // Validate wholesale pricing
    formData.wholesalePricing.forEach((tier, index) => {
      if (tier.price <= 0) errors.push(`Tier ${index + 1} price must be greater than 0`);
      if (tier.minQty < 0) errors.push(`Tier ${index + 1} min quantity cannot be negative`);
      if (tier.maxQty !== null && tier.maxQty < tier.minQty) {
        errors.push(`Tier ${index + 1} max quantity cannot be less than min quantity`);
      }
    });

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        images: uploadImages.map(image => image.secure_url),
        // Set regularPrice to retailPrice if not explicitly set
        regularPrice: formData.regularPrice || formData.retailPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      console.log("Submitting product data:", productData);
      createProductMutation.mutate(productData);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/products"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-gray-600">
              Create a new product in your catalog
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={addCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || createProductMutation.isPending}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {createProductMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* SKU and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Product SKU"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateSKU}
                      className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories?.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Brand and Import Origin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    {brands?.map((brand) => (
                      <option key={brand._id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import Origin
                  </label>
                  <input
                    type="text"
                    name="importOrigin"
                    value={formData.importOrigin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Japan, USA, China"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your product..."
                />
              </div>
            </div>
          </div>

          {/* Wholesale Pricing Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Wholesale Pricing Tiers
            </h2>

            <div className="space-y-4">
              {formData.wholesalePricing.map((tier, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Tier {index + 1}</h3>
                    {formData.wholesalePricing.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWholesaleTier(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        value={tier.label}
                        onChange={(e) => handleWholesalePricingChange(index, 'label', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Tier label"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Qty
                      </label>
                      <input
                        type="number"
                        value={tier.minQty}
                        onChange={(e) => handleWholesalePricingChange(index, 'minQty', e.target.value)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Qty
                      </label>
                      <input
                        type="number"
                        value={tier.maxQty === null ? '' : tier.maxQty}
                        onChange={(e) => handleWholesalePricingChange(index, 'maxQty', e.target.value)}
                        min="0"
                        placeholder="Leave empty for unlimited"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        value={tier.price}
                        onChange={(e) => handleWholesalePricingChange(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={tier.discount}
                      onChange={(e) => handleWholesalePricingChange(index, 'discount', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">Show as discounted tier</span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addWholesaleTier}
                className="flex items-center space-x-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
                <span>Add Another Tier</span>
              </button>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Product Images *
            </h2>

            <div className="space-y-4">
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={imageHandler}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <Upload size={48} className="text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Upload Images
                    </p>
                    <p className="text-gray-600">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Select Files
                  </button>
                </label>
              </div>

              {/* Image Previews */}
              {uploadImages.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Uploaded Images ({uploadImages.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview.secure_url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={16} />
                        </button>
                        {index === 0 && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Pricing, Inventory & Settings */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Basic Pricing
            </h2>

            <div className="space-y-4">
              {/* Retail Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retail Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="retailPrice"
                    value={formData.retailPrice}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Regular Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Price (for comparison)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    name="regularPrice"
                    value={formData.regularPrice}
                    onChange={handleNumberChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Discount */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Discount
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isDiscountActive"
                      checked={formData.isDiscountActive}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600">
                      Enable Discount
                    </span>
                  </label>
                </div>

                {formData.isDiscountActive && (
                  <div>
                    <div className="relative">
                      <input
                        type="number"
                        name="discountPercent"
                        value={formData.discountPercent}
                        onChange={handleNumberChange}
                        min="0"
                        max="100"
                        className="w-full pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        %
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Inventory & Ratings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleNumberChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleNumberChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Count
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleNumberChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Settings Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Product Settings
            </h2>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Product Flags */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Product Flags
                </label>

                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        Featured Product
                      </p>
                      <p className="text-sm text-gray-600">
                        Show this product in featured sections
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">New Arrival</p>
                      <p className="text-sm text-gray-600">
                        Mark as new product
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isTopSeller"
                      checked={formData.isTopSeller}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Top Seller</p>
                      <p className="text-sm text-gray-600">
                        Mark as best-selling product
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
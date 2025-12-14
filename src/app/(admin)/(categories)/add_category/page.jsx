"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Building, Globe, FileText } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const AddBrand = () => {
  const route = useRouter()
  // ✅ useForm hook setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  // ✅ onSubmit function
  const onSubmit = async (data) => {
    try {
      const res = await apiClient.post(
        `/categories`,
        {
          ...data,
          productCount: 0,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
         
        reset();
      } else {
        toast.error("❌ Failed to add brand.");
      }
    } catch (error) {
      if (error.status === 409) {
        toast.warning("Brand already exists");
      } else {
        toast.error("⚠️ Something went wrong!");
      }
    }
  };

  const countries = [
    "United States",
    "Germany",
    "Japan",
    "South Korea",
    "China",
    "United Kingdom",
    "France",
    "Italy",
    "Canada",
    "Australia",
    "Switzerland",
    "Sweden",
    "Netherlands",
    "Spain",
    "Brazil",
  ];

  return (
    <AdminProtectedRoute>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/brands"
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Add New Category
              </h1>
              <p className="text-gray-600 text-sm">
                Create a new product Category
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/dashboard/brands"
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60 cursor-pointer"
            >
              <Save size={18} />
              <span>{isSubmitting ? "Saving..." : "Save Category"}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building size={20} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Category Information
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Category name is required",
                      minLength: {
                        value: 2,
                        message: "Category name must be at least 2 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., Nike, Apple, Samsung, Sony"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country of Origin <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe size={16} className="text-gray-400" />
                    </div>
                    <select
                      {...register("country", {
                        required: "Country is required",
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors appearance-none bg-white ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a country...</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3">
                      <FileText size={16} className="text-gray-400" />
                    </div>
                    <textarea
                      rows={4}
                      {...register("description", {
                        maxLength: {
                          value: 500,
                          message: "Description cannot exceed 500 characters",
                        },
                      })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Describe the brand, its products, mission, and unique selling points..."
                    />
                  </div>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register("status", { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">
                      Active - Visible to customers
                    </option>
                    <option value="inactive">
                      Inactive - Hidden from customers
                    </option>
                  </select>
                </div>

                {/* Submit Button (For small screens) */}
                <div className="block md:hidden pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center justify-center w-full space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60"
                  >
                    <Save size={18} />
                    <span>{isSubmitting ? "Saving..." : "Save Brand"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 rounded-b-xl">
              <p className="text-sm text-gray-600">
                All required fields are marked with{" "}
                <span className="text-red-500">*</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AddBrand;

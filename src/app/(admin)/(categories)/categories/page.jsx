// components/CategoriesTable.jsx
"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ShoppingLoading from "@/components/Loading/Loading";
import { toast } from "react-toastify";

const CategoriesTable = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/categories`
      );
      return res.data;
    },
  });
  const delateProduct = useMutation({
    mutationFn: async(id) => {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`)
      return res.data
    },
    onSuccess: (data) => {
      toast.success("Category delete successfully")
      queryClient.invalidateQueries(['categories']);

    }
  })
  if (isLoading) {
    return <ShoppingLoading></ShoppingLoading>;
  }

  const categories = data.data || [];

  console.log(categories);

  const hasCategories = categories && categories.length > 0;

  const totalCategories = categories?.length;
  const activeCategories = categories.filter(
    (cat) => cat.status === "active"
  ).length;
  const inActiveCategories = categories.filter(
    (cat) => cat.status === "inactive"
  ).length;

  console.log(inActiveCategories);

  const delateCategory = (id) => {
     delateProduct.mutate(id)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">
            Manage product categories and organization
          </p>
        </div>
        <Link
          href="/add_category"
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Category</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {" "}
                {totalCategories.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {activeCategories.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Inactive Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {inActiveCategories.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">856</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <CheckCircle size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search categories by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {hasCategories ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Category Name
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Created Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Updated Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Category Row */}
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <CheckCircle size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {cat.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-700 max-w-xs truncate">
                        {cat.description || "N/A"}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          cat.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {cat.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(cat.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6 text-gray-700">
                      {new Date(cat.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href="/dashboard/categories/1"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/edit_category/${cat._id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Category"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                        onClick={()=> delateCategory(cat._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Link
              href="/dashboard/categories/add"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Your First Category</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">5</span> of{" "}
              <span className="font-medium">24</span> categories
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700 transition-colors">
                1
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                3
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesTable;

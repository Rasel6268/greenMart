"use client";
import React from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import ShoppingLoading from "@/components/Loading/Loading";
import { toast } from "react-toastify";

const BrandsTable = () => {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ["brand"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/brands`);
      return res.data.data;
    },
  });
  const deleteBrandMutation = useMutation({
    mutationFn: async(id) => {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/brands/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Brand deleted successfully")
      queryClient.invalidateQueries(['brand'])
    }
  })

const deleteBrand = (id) =>{
  deleteBrandMutation.mutate(id)
  
}
  if (isLoading) {
    return <ShoppingLoading></ShoppingLoading>;
  }
  if (error) {
    return null;
  }
  const brands = data || [];
  const hasBrand = brands && brands.length > 0;

  const totalBrands = brands.length;
  const activeBrand = brands.filter(
    (brand) => brand.status === "active"
  ).length;
  const inactiveBrand = brands.filter(
    (brand) => brand.status === "inacive"
  ).length;

  console.log(data);
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">
            Manage product brands and manufacturers
          </p>
        </div>
        <Link
          href="/add_brand"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Brand</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Brands</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalBrands.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Brands</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {activeBrand.toString().padStart(2, "0")}
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
                Inactive Brands
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {inactiveBrand.toString().padStart(2, "0")}
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
                Brand Products
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">642</p>
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
                placeholder="Search brands by name, country, or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Country Filter */}
          <div className="lg:w-48">
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">All Countries</option>
              <option value="usa">United States</option>
              <option value="germany">Germany</option>
              <option value="japan">Japan</option>
              <option value="korea">South Korea</option>
              <option value="china">China</option>
            </select>
          </div>

          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {hasBrand ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Brand
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Country
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Status
                  </th>
                  
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Products
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Brand Row */}
                {
                  brands.map(brand => (
                    <tr key={brand._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{brand.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{brand.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-700">{brand.country || "N/A"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-700 max-w-xs truncate">
                      {brand.description || "Innovative technology company creating revolutionary consumer electronics"}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </td>
                 
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      156
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link
                        href="/dashboard/brands/1"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href="/dashboard/brands/edit/1"
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Brand"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                      onClick={()=> deleteBrand(brand._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Brand"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
                  ))
                }
                </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Building size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No brands found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Link
              href="/dashboard/brands/add"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Your First Brand</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">5</span> of{" "}
              <span className="font-medium">18</span> brands
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
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

export default BrandsTable;

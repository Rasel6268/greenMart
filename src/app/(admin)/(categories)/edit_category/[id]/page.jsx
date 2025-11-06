'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, Building, Globe, FileText } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Edit_category = ({ params }) => {
  const { id } = React.use(params);
  const base_url = process.env.NEXT_PUBLIC_API_URL;
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Get category by id
  const { data, isLoading, error } = useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const res = await axios.get(`${base_url}/categories/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  // Update mutation for editing category
  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await axios.put(`${base_url}/categories/${id}`, formData);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Category updated successfully!');
        // Invalidate and refetch categories
        queryClient.invalidateQueries(['category', id]);
        queryClient.invalidateQueries(['categories']);
      } else {
        toast.error(data.message || '❌ Failed to update category.');
      }
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        toast.warning('Category already exists');
      } else if (error.response?.status === 404) {
        toast.error('Category not found');
      } else {
        toast.error('⚠️ Something went wrong while updating category!');
      }
    },
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (data) {
      reset({
        name: data.name || '',
        country: data.country || '',
        description: data.description || '',
        status: data.status || 'active',
      });
    }
  }, [data, reset]);

  // ✅ onSubmit function for EDIT
  const onSubmit = async (formData) => {
    try {
      await updateMutation.mutateAsync(formData);
    } catch (error) {
      // Error handling is done in mutation onError
      console.error('Update error:', error);
    }
  };

  const countries = [
    'United States',
    'Germany',
    'Japan',
    'South Korea',
    'China',
    'United Kingdom',
    'France',
    'Italy',
    'Canada',
    'Australia',
    'Switzerland',
    'Sweden',
    'Netherlands',
    'Spain',
    'Brazil'
  ];

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <p className="text-gray-600">Loading category data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading category: {error.message}</p>
          <Link
            href="/dashboard/categories"
            className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/categories"
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600 text-sm">Update existing product category</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/categories"
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || updateMutation.isLoading}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60"
          >
            <Save size={18} />
            <span>{(isSubmitting || updateMutation.isLoading) ? 'Updating...' : 'Update Category'}</span>
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
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Category name is required',
                    minLength: {
                      value: 2,
                      message: 'Category name must be at least 2 characters',
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Electronics, Clothing, Home & Garden"
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
                    {...register('country', {
                      required: 'Country is required',
                    })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors appearance-none bg-white ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a country...</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.country && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* Description */}
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
                    {...register('description', {
                      maxLength: {
                        value: 500,
                        message: 'Description cannot exceed 500 characters',
                      },
                    })}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the category, its products, and features..."
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
                  {...register('status', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="active">Active - Visible to customers</option>
                  <option value="inactive">Inactive - Hidden from customers</option>
                </select>
              </div>

              {/* Submit Button (For small screens) */}
              <div className="block md:hidden pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || updateMutation.isLoading}
                  className="flex items-center justify-center w-full space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-60"
                >
                  <Save size={18} />
                  <span>{(isSubmitting || updateMutation.isLoading) ? 'Updating...' : 'Update Category'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 rounded-b-xl">
            <p className="text-sm text-gray-600">
              All required fields are marked with <span className="text-red-500">*</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit_category;
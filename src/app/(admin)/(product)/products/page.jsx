// components/ProductsTable.jsx
"use client"
import React, { useState } from 'react';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Filter,
  Package,
  AlertCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { infiniteQueryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import ShoppingLoading from '@/components/Loading/Loading';
import { toast } from 'react-toastify';


const ProductsTable = () => {
  const queryClient = useQueryClient() 
  const {data: products = [],isLoading,error} = useQuery({
    queryKey: ["Products"],
    queryFn: async() => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      return res.data.products
    }
  })

  const delateProduct = useMutation({
    mutationFn : async(id) => {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
    return res.data
    },
    onSuccess: () => {
      toast.success('Product Deleted successfully')
      queryClient.invalidateQueries(['Products'])
    }
  })
  
  

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', 'Electronics', 'Clothing', 'Home & Kitchen', 'Sports'];
  const statuses = ['all', 'active', 'inactive'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  console.log(filteredProducts.map(item => {
    console.log(item)
  }))

  const calculateDiscountedPrice = (price, discountPercent) => {
    return price - (price * discountPercent / 100);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product._id !== productId));
    }
  };

  const handleStatusToggle = (productId) => {
    setProducts(products.map(product => 
      product._id === productId 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };
  if(isLoading){
    return <ShoppingLoading></ShoppingLoading>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <Link
          href="/add_product"
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {products.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Eye size={24} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {products.filter(p => p.isFeatured).length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star size={24} className="text-purple-600" />
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name, SKU, or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="lg:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={20} />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">SKU</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Brand</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  {/* Product Info */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.isFeatured && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Featured</span>
                          )}
                          {product.isNewArrival && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                          )}
                          {product.isTopSeller && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Top Seller</span>
                          )}
                          {product.isDiscountActive && (
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">{product.discountPercent}% Off</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 px-6">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{product.sku}</code>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {product.category}
                    </span>
                  </td>

                  {/* Brand */}
                  <td className="py-4 px-6 text-gray-900">{product.brand}</td>

                  {/* Stock */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' : 
                        product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {product.stock}
                      </span>
                      {product.stock === 0 && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {product.isDiscountActive ? (
                        <>
                          <p className="text-gray-900 font-semibold">
                            ${calculateDiscountedPrice(product.retailPrice, product.discountPercent).toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-sm line-through">
                            ${product.retailPrice.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-900 font-semibold">
                          ${product.retailPrice.toFixed(2)}
                        </p>
                      )}
                      {product.wholesalePrice && (
                        <p className="text-blue-600 text-xs">
                          Wholesale: ${product.wholesalePrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleStatusToggle(product._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/dashboard/products/${product._id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/products/edit/${product._id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => delateProduct.mutate(product._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
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

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Link
              href="/admin/dashboard/addproduct"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Your First Product</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of{' '}
                <span className="font-medium">{filteredProducts.length}</span> results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsTable;
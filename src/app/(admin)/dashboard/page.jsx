// components/Dashboard.jsx
"use client";
import React from "react";
import {
  ShoppingCart,
  Package,
  Tags,
  Users,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";

// Simple placeholder chart components
const RevenueChart = () => {
  const { user, loading, adminLoading, isAdmin } = useAuth();
  return (
    <div className="h-80 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <TrendingUp size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Revenue Chart</p>
        <p className="text-sm">Chart.js or Recharts would be integrated here</p>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-end justify-center space-x-2 h-32">
            {[40, 60, 75, 55, 80, 65, 90, 70, 85, 95, 80, 75].map(
              (height, index) => (
                <div
                  key={index}
                  className="w-6 bg-gradient-to-t from-green-400 to-green-600 rounded-t transition-all hover:from-green-300 hover:to-green-500"
                  style={{ height: `${height}%` }}
                />
              )
            )}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryChart = () => {
  const categories = [
    { name: "Electronics", value: 35, color: "bg-blue-500" },
    { name: "Clothing", value: 25, color: "bg-green-500" },
    { name: "Home & Kitchen", value: 20, color: "bg-purple-500" },
    { name: "Sports", value: 15, color: "bg-orange-500" },
    { name: "Books", value: 5, color: "bg-red-500" },
  ];

  return (
    <div className="h-80">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2 flex-1">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 ${category.color} rounded-full mr-2`} />
              <span className="text-sm text-gray-600 flex-1">
                {category.name}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {category.value}%
              </span>
            </div>
          ))}
        </div>
        <div className="ml-8">
          <div className="w-32 h-32 rounded-full bg-gradient-conic from-blue-500 via-green-500 to-purple-500 relative">
            <div className="absolute inset-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          Category distribution by sales volume
        </p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Demo data
  const statsData = [
    {
      title: "Total Orders",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: "856",
      change: "+8.2%",
      trend: "up",
      icon: Package,
      color: "bg-green-500",
    },
    {
      title: "Categories",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Tags,
      color: "bg-purple-500",
    },
    {
      title: "Brands",
      value: "48",
      change: "+5",
      trend: "up",
      icon: Eye,
      color: "bg-orange-500",
    },
    {
      title: "Wholesalers",
      value: "156",
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      title: "Revenue",
      value: "$45,289",
      change: "+18.4%",
      trend: "up",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-7841",
      customer: "Sarah Johnson",
      date: "2024-01-15",
      amount: "$289.99",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "#ORD-7840",
      customer: "Mike Chen",
      date: "2024-01-15",
      amount: "$156.50",
      status: "Processing",
      statusColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "#ORD-7839",
      customer: "Emily Davis",
      date: "2024-01-14",
      amount: "$542.75",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800",
    },
    {
      id: "#ORD-7838",
      customer: "Robert Wilson",
      date: "2024-01-14",
      amount: "$89.99",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-800",
    },
    {
      id: "#ORD-7837",
      customer: "Lisa Brown",
      date: "2024-01-13",
      amount: "$324.25",
      status: "Completed",
      statusColor: "bg-green-100 text-green-800",
    },
  ];

  const topSellingProducts = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$89.99",
      sales: 142,
      revenue: "$12,778.58",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Organic Cotton T-Shirt",
      category: "Clothing",
      price: "$24.99",
      sales: 98,
      revenue: "$2,449.02",
      rating: 4.6,
    },
    {
      id: 3,
      name: "Stainless Steel Water Bottle",
      category: "Home & Kitchen",
      price: "$29.99",
      sales: 87,
      revenue: "$2,609.13",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Yoga Mat Premium",
      category: "Sports",
      price: "$45.99",
      sales: 76,
      revenue: "$3,495.24",
      rating: 4.7,
    },
    {
      id: 5,
      name: "Smart Fitness Watch",
      category: "Electronics",
      price: "$199.99",
      sales: 63,
      revenue: "$12,599.37",
      rating: 4.5,
    },
  ];

  const recentRegistrations = [
    {
      id: 1,
      name: "Alex Thompson",
      email: "alex@example.com",
      type: "Customer",
      date: "2024-01-15",
      status: "Active",
    },
    {
      id: 2,
      name: "Global Supplies Inc.",
      email: "contact@globalsupplies.com",
      type: "Wholesaler",
      date: "2024-01-15",
      status: "Pending",
    },
    {
      id: 3,
      name: "Maria Garcia",
      email: "maria@example.com",
      type: "Customer",
      date: "2024-01-14",
      status: "Active",
    },
    {
      id: 4,
      name: "Tech Distributors LLC",
      email: "sales@techdist.com",
      type: "Wholesaler",
      date: "2024-01-14",
      status: "Active",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david@example.com",
      type: "Customer",
      date: "2024-01-13",
      status: "Active",
    },
  ];

  return (
    <AdminProtectedRoute>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors">
              <Plus size={20} />
              <span>Add Product</span>
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
          {statsData.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                    <div
                      className={`flex items-center mt-2 text-sm ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      )}
                      <span className="ml-1">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg ml-3`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Analytics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Revenue Analytics
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            <RevenueChart />
          </div>

          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Category Distribution
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full sm:w-auto">
                <option>By Sales</option>
                <option>By Revenue</option>
                <option>By Products</option>
              </select>
            </div>
            <CategoryChart />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 xl:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Recent Orders
              </h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {order.amount}
                      </p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${order.statusColor} whitespace-nowrap`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Recent Registrations
              </h2>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentRegistrations.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors gap-2"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "Wholesaler"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.type}
                      </span>
                      <p className="text-sm text-gray-600 mt-1">{user.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Top Selling Products
            </h2>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All Products
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Sales
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Revenue
                  </th>
                  <th className="text-left py-3 font-semibold text-gray-900">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSellingProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4">
                      <p className="font-medium text-gray-900">
                        {product.name}
                      </p>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4 text-gray-900">{product.price}</td>
                    <td className="py-4 text-gray-900">{product.sales}</td>
                    <td className="py-4 font-semibold text-green-600">
                      {product.revenue}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-current"
                        />
                        <span className="ml-1 text-gray-900">
                          {product.rating}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <p className="text-sm opacity-90">Conversion Rate</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">3.24%</p>
            <p className="text-xs opacity-90 mt-1">+0.5% from last week</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
            <p className="text-sm opacity-90">Avg. Order Value</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">$156.80</p>
            <p className="text-xs opacity-90 mt-1">+$12.40 from last month</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <p className="text-sm opacity-90">Customer Satisfaction</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">94.2%</p>
            <p className="text-xs opacity-90 mt-1">Based on 284 reviews</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
            <p className="text-sm opacity-90">Inventory Alert</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">12 items</p>
            <p className="text-xs opacity-90 mt-1">Low stock products</p>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default Dashboard;

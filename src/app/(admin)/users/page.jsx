"use client";
import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  User,
  Users,
  CheckCircle,
  XCircle,
  Star,
  Download,
  Building,
  Calendar,
  Clock,
  Shield,
  ShieldOff,
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import apiClient from "@/lib/apiClient";

const CustomersTable = () => {
  const [activeTab, setActiveTab] = useState("regular");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const queryClient = useQueryClient();

  
  const {
    data: allUsers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await apiClient.get(`/users/all_users`);
      return res.data.users;
    },
  });

  // Mutation for updating user role
  const updateRoleMutation = useMutation({
    mutationFn: async ({ email, newRole }) => {
      const res = await apiClient.put(`/users/${email}/role`, {
        role: newRole,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      alert("User role updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      alert("Error updating user role. Please try again.");
    },
  });

  // Separate users by type
  const regularCustomers = allUsers.filter(
    (user) => user.role === "user" || !user.role
  );
  const adminUsers = allUsers.filter((user) => user.role === "admin");

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} className="text-green-600" />;
      case "inactive":
        return <XCircle size={16} className="text-red-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "suspended":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <User size={16} className="text-gray-600" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "pending":
        return "Pending Approval";
      case "suspended":
        return "Suspended";
      default:
        return "Unknown";
    }
  };

  const getRoleBadge = (role) => {
    const isAdmin = role === "admin";
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          isAdmin
            ? "bg-purple-100 text-purple-800 border border-purple-200"
            : "bg-blue-100 text-blue-800 border border-blue-200"
        }`}
      >
        {isAdmin ? "Admin" : "User"}
      </span>
    );
  };

  const handleRoleChange = (email, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const actionText =
      currentRole === "admin" ? "remove admin privileges from" : "make";

    const title =
      currentRole === "admin" ? "Remove Admin Privileges" : "Make User Admin";

    const icon = currentRole === "admin" ? "warning" : "question";

    Swal.fire({
      title: title,
      html: `Are you sure you want to ${actionText} <strong>${email}</strong>?`,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: currentRole === "admin" ? "#d33" : "#3085d6",
      cancelButtonColor: "#6b7280",
      confirmButtonText:
        currentRole === "admin" ? "Yes, remove admin" : "Yes, make admin",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "px-4 py-2 rounded-lg font-medium",
        cancelButton: "px-4 py-2 rounded-lg font-medium",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        updateRoleMutation.mutate(
          { email, newRole },
          {
            onSuccess: () => {
              Swal.fire({
                title: "Success!",
                text: `User role has been ${
                  currentRole === "admin"
                    ? "removed from admin"
                    : "updated to admin"
                } successfully.`,
                icon: "success",
                confirmButtonColor: "#10b981",
                confirmButtonText: "OK",
                timer: 3000,
                timerProgressBar: true,
              });
            },
            onError: (error) => {
              Swal.fire({
                title: "Error!",
                text: "Failed to update user role. Please try again.",
                icon: "error",
                confirmButtonColor: "#ef4444",
                confirmButtonText: "OK",
              });
            },
          }
        );
      }
    });
  };

  const currentCustomers =
    activeTab === "regular" ? regularCustomers : adminUsers;

  const toggleCustomerSelection = (customerId) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const toggleAllCustomers = () => {
    setSelectedCustomers(
      selectedCustomers.length === currentCustomers.length
        ? []
        : currentCustomers.map((customer) => customer._id || customer.id)
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg text-red-600">Error loading users</div>
      </div>
    );
  }

  return (
    <AdminProtectedRoute>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600">
              Manage regular users and administrators
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {allUsers.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Regular Users
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {regularCustomers.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round(
                    (regularCustomers.length / allUsers.length) * 100
                  )}
                  % of total
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <User size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Administrators
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {adminUsers.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((adminUsers.length / allUsers.length) * 100)}% of
                  total
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Shield size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {allUsers.filter((user) => user.status === "active").length}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {Math.round(
                    (allUsers.filter((user) => user.status === "active")
                      .length /
                      allUsers.length) *
                      100
                  )}
                  % active rate
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Star size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("regular")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "regular"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Regular Users</span>
                  <span className="bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                    {regularCustomers.length}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "admin"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield size={20} />
                  <span>Administrators</span>
                  <span className="bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                    {adminUsers.length}
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Filters and Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="lg:w-48">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="lg:w-48">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter size={20} />
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-12 py-4 px-6">
                    <input
                      type="checkbox"
                      checked={
                        selectedCustomers.length === currentCustomers.length &&
                        currentCustomers.length > 0
                      }
                      onChange={toggleAllCustomers}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    User
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Role
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Join Date
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((user) => (
                  <tr
                    key={user._id || user.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(
                          user._id || user.id
                        )}
                        onChange={() =>
                          toggleCustomerSelection(user._id || user.id)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {user.fullName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("") ||
                              user.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("") ||
                              "UU"}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {user.fullName || user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.city}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {user.email}
                          </span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {user.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6">{getRoleBadge(user.userRole)}</td>
                    <td className="py-4 px-6 text-gray-700">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/dashboard/users/${user._id || user.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>

                        {/* Make Admin/Remove Admin Button */}
                        <button
                          onClick={() =>
                            handleRoleChange(user.email, user.userRole)
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            user.userRole === "admin"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                          }`}
                          title={
                            user.userRole === "admin"
                              ? "Remove Admin"
                              : "Make Admin"
                          }
                          disabled={updateRoleMutation.isPending}
                        >
                          {user.userRole === "admin" ? (
                            <ShieldOff size={18} />
                          ) : (
                            <Shield size={18} />
                          )}
                        </button>

                        <Link
                          href={`/admin/dashboard/users/edit/${
                            user._id || user.id
                          }`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </Link>

                        <button
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
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
          {currentCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No{" "}
                {activeTab === "regular" ? "regular users" : "administrators"}{" "}
                found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filters
              </p>
              <Link
                href="/admin/dashboard/addcustomer"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add New User</span>
              </Link>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">{currentCustomers.length}</span>{" "}
                of{" "}
                <span className="font-medium">{currentCustomers.length}</span>{" "}
                users
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default CustomersTable;

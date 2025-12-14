"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import instance from "@/lib/instance";
import apiClient from "@/lib/apiClient";
import { FaEdit, FaTrash, FaEye, FaTimes } from "react-icons/fa";
import Link from "next/link";

export default function AdminShipping() {
  const [activeTab, setActiveTab] = useState("districts");
  const [loading, setLoading] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [editingDistrict, setEditingDistrict] = useState(null);
  const [editingUpozila, setEditingUpozila] = useState(null);
  const queryClient = useQueryClient();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // District Form State
  const [districtForm, setDistrictForm] = useState({
    name: "",
    division: "",
    deliveryAvailable: true,
  });

  // Upozila Form State
  const [upozilaForm, setUpozilaForm] = useState({
    name: "",
    district: "",
    shippingCost: "",
    deliveryTime: "2-3 days",
    codAvailable: true,
  });

  // Fetch districts with React Query
  const { data: districts = [] } = useQuery({
    queryKey: ["districts"],
    queryFn: async () => {
      const res = await instance.get(`/district`);
      return res.data.data;
    },
  });
  

  // Fetch upozilas with React Query
  const { data: upozilas = [] } = useQuery({
    queryKey: ["upozilas"],
    queryFn: async () => {
      const res = await instance.get(`/upozila`);
      return res.data.data;
    },
  });

  // District mutation
  const districtMutation = useMutation({
    mutationFn: async (districtData) => {
      const res = editingDistrict 
        ? await apiClient.put(`/district/${editingDistrict._id}`, districtData)
        : await apiClient.post(`/district`, districtData);
      return res.data;
    },
    onSuccess: () => {
      toast.success(editingDistrict ? "District updated successfully!" : "District added successfully!");
      setDistrictForm({ name: "", division: "", deliveryAvailable: true });
      setEditingDistrict(null);
      setActiveTab("upozilas");
      queryClient.invalidateQueries(["districts"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || (editingDistrict ? "Error updating district" : "Error adding district"));
      console.error("Error:", error);
    },
  });

  // Upozila mutation
  const upozilaMutation = useMutation({
    mutationFn: async (upozilaData) => {
      const res = editingUpozila
        ? await apiClient.put(`/upozila/${editingUpozila._id}`, upozilaData)
        : await apiClient.post(`/upozila`, upozilaData);
      return res.data;
    },
    onSuccess: () => {
      toast.success(editingUpozila ? "Upozila updated successfully!" : "Upozila added successfully!");
      setUpozilaForm({
        name: "",
        district: "",
        shippingCost: "",
        deliveryTime: "2-3 days",
        codAvailable: true,
      });
      setEditingUpozila(null);
      queryClient.invalidateQueries(["upozilas"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || (editingUpozila ? "Error updating upozila" : "Error adding upozila"));
      console.error("Error:", error);
    },
  });

  // Handle District Form Submit
  const handleDistrictSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    districtMutation.mutate(districtForm, {
      onSettled: () => setLoading(false),
    });
  };

  // Handle Upozila Form Submit
  const handleUpozilaSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    upozilaMutation.mutate(upozilaForm, {
      onSettled: () => setLoading(false),
    });
  };

  // Delete District mutation
  const deleteDistrictMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/district/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "District has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      queryClient.invalidateQueries(["districts"]);
      queryClient.invalidateQueries(["upozilas"]);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete district. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545"
      });
      console.error("Error deleting district:", error);
    },
  });

  // Delete Upozila mutation
  const deleteUpozilaMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.delete(`/upozila/${id}`);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Deleted!",
        text: "Upozila has been deleted successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });
      queryClient.invalidateQueries(["upozilas"]);
    },
    onError: (error) => {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to delete upozila. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc3545"
      });
      console.error("Error deleting upozila:", error);
    },
  });

  // Edit District
  const handleEditDistrict = (district) => {
    setEditingDistrict(district);
    setDistrictForm({
      name: district.name,
      division: district.division,
      deliveryAvailable: district.deliveryAvailable,
    });
    setActiveTab("districts");
  };

  // Edit Upozila
  const handleEditUpozila = (upozila) => {
    setEditingUpozila(upozila);
    setUpozilaForm({
      name: upozila.name,
      district: upozila.district._id || upozila.district,
      shippingCost: upozila.shippingCost,
      deliveryTime: upozila.deliveryTime,
      codAvailable: upozila.codAvailable,
    });
    setActiveTab("upozilas");
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    if (editingDistrict) {
      setEditingDistrict(null);
      setDistrictForm({ name: "", division: "", deliveryAvailable: true });
    }
    if (editingUpozila) {
      setEditingUpozila(null);
      setUpozilaForm({
        name: "",
        district: "",
        shippingCost: "",
        deliveryTime: "2-3 days",
        codAvailable: true,
      });
    }
  };

  // Delete District with SweetAlert2
  const handleDeleteDistrict = async (id) => {
    const districtName = districts.find(d => d._id === id)?.name || "this district";
    
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `<p>You are about to delete <strong>${districtName}</strong>.</p>
             <p class="text-red-600 mt-2">This will also delete all upozilas in this district!</p>
             <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return deleteDistrictMutation.mutateAsync(id);
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isDismissed) {
      Swal.fire({
        title: "Cancelled",
        text: "District deletion was cancelled.",
        icon: "info",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Delete Upozila with SweetAlert2
  const handleDeleteUpozila = async (id) => {
    const upozilaData = upozilas.find(u => u._id === id);
    if (!upozilaData) return;
    
    const result = await Swal.fire({
      title: "Are you sure?",
      html: `<p>You are about to delete <strong>${upozilaData.name}</strong> upozila.</p>
             <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return deleteUpozilaMutation.mutateAsync(id);
      },
      allowOutsideClick: () => !Swal.isLoading()
    });

    if (result.isDismissed) {
      Swal.fire({
        title: "Cancelled",
        text: "Upozila deletion was cancelled.",
        icon: "info",
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  // Input change handlers
  const handleDistrictInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDistrictForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpozilaInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpozilaForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Filter upozilas by selected district
  const filteredUpozilas = selectedDistrict
    ? upozilas.filter((upozila) => upozila.district._id === selectedDistrict)
    : upozilas;

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Shipping Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage districts and upozilas with shipping costs
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => {
                    setActiveTab("districts");
                    handleCancelEdit();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "districts"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Districts
                </button>
                <button
                  onClick={() => {
                    setActiveTab("upozilas");
                    handleCancelEdit();
                  }}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "upozilas"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Upozilas
                </button>
              </nav>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Side - Forms */}
            <div className="xl:col-span-1 space-y-6">
              {/* District Form */}
              {activeTab === "districts" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingDistrict ? "Edit District" : "Add New District"}
                    </h2>
                    {editingDistrict && (
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleDistrictSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={districtForm.name}
                        onChange={handleDistrictInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="Enter district name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Division *
                      </label>
                      <select
                        name="division"
                        value={districtForm.division}
                        onChange={handleDistrictInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        required
                      >
                        <option value="">Select Division</option>
                        <option value="DHAKA">Dhaka</option>
                        <option value="CHITTAGONG">Chittagong</option>
                        <option value="SYLHET">Sylhet</option>
                        <option value="KHULNA">Khulna</option>
                        <option value="RAJSHAHI">Rajshahi</option>
                        <option value="BARISAL">Barisal</option>
                        <option value="RANGPUR">Rangpur</option>
                        <option value="MYMENSINGH">Mymensingh</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="deliveryAvailable"
                        id="deliveryAvailable"
                        checked={districtForm.deliveryAvailable}
                        onChange={handleDistrictInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="deliveryAvailable"
                        className="text-sm text-gray-700"
                      >
                        Delivery Available
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading || districtMutation.isLoading}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading || districtMutation.isLoading
                          ? editingDistrict
                            ? "Updating..."
                            : "Adding..."
                          : editingDistrict
                          ? "Update District"
                          : "Add District"}
                      </button>
                      {editingDistrict && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}

              {/* Upozila Form */}
              {activeTab === "upozilas" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingUpozila ? "Edit Upozila" : "Add New Upozila"}
                    </h2>
                    {editingUpozila && (
                      <button
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <form onSubmit={handleUpozilaSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upozila Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={upozilaForm.name}
                        onChange={handleUpozilaInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="Enter upozila name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        District *
                      </label>
                      <select
                        name="district"
                        value={upozilaForm.district}
                        onChange={handleUpozilaInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        required
                      >
                        <option value="">Select District</option>
                        {districts.map((district) => (
                          <option key={district._id} value={district._id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Cost (৳) *
                      </label>
                      <input
                        type="number"
                        name="shippingCost"
                        value={upozilaForm.shippingCost}
                        onChange={handleUpozilaInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        placeholder="Enter shipping cost"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Time
                      </label>
                      <select
                        name="deliveryTime"
                        value={upozilaForm.deliveryTime}
                        onChange={handleUpozilaInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      >
                        <option value="1-2 days">1-2 days</option>
                        <option value="2-3 days">2-3 days</option>
                        <option value="3-5 days">3-5 days</option>
                        <option value="5-7 days">5-7 days</option>
                        <option value="7-10 days">7-10 days</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="codAvailable"
                        id="codAvailable"
                        checked={upozilaForm.codAvailable}
                        onChange={handleUpozilaInputChange}
                        className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="codAvailable"
                        className="text-sm text-gray-700"
                      >
                        Cash on Delivery Available
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={loading || upozilaMutation.isLoading}
                        className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading || upozilaMutation.isLoading
                          ? editingUpozila
                            ? "Updating..."
                            : "Adding..."
                          : editingUpozila
                          ? "Update Upozila"
                          : "Add Upozila"}
                      </button>
                      {editingUpozila && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Right Side - Data Tables */}
            <div className="xl:col-span-2">
              {/* Districts Table */}
              {activeTab === "districts" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      All Districts
                    </h2>
                    <span className="text-sm text-gray-500">
                      {districts.length} districts
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            District Name
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Division
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Delivery
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {districts.map((district) => {
                          return (
                            <tr
                              key={district._id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4 text-sm text-gray-900">
                                <div className="font-medium">
                                  {district.name}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {district.division}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    district.deliveryAvailable
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {district.deliveryAvailable
                                    ? "Available"
                                    : "Not Available"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleEditDistrict(district)}
                                    className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium transition-colors hover:bg-green-50 px-3 py-1.5 rounded-lg"
                                    title="Edit"
                                  >
                                    <FaEdit className="w-4 h-4" />
                                    
                                  </button>
                                  <button
                                    onClick={() => handleDeleteDistrict(district._id)}
                                    disabled={deleteDistrictMutation.isLoading}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors hover:bg-red-50 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete"
                                  >
                                    <FaTrash className="w-4 h-4" />
                                    
                                  </button>
                                 
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {districts.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No districts found. Add your first district above.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upozilas Table */}
              {activeTab === "upozilas" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        All Upozilas
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        {filteredUpozilas.length} upozilas
                        {selectedDistrict &&
                          ` in ${
                            districts.find((d) => d._id === selectedDistrict)
                              ?.name
                          }`}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">All Districts</option>
                        {districts.map((district) => (
                          <option key={district._id} value={district._id}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Upozila Name
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            District
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Shipping Cost
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Delivery Time
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            COD
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUpozilas.map((upozila) => (
                          <tr
                            key={upozila._id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-sm text-gray-900">
                              <div className="font-medium">{upozila.name}</div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {upozila.district.name}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 font-semibold">
                              ৳{upozila.shippingCost}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">
                              {upozila.deliveryTime}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  upozila.codAvailable
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {upozila.codAvailable
                                  ? "Available"
                                  : "Not Available"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEditUpozila(upozila)}
                                  className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium transition-colors hover:bg-green-50 px-3 py-1.5 rounded-lg"
                                  title="Edit"
                                >
                                  <FaEdit className="w-4 h-4" />
                                  
                                </button>
                                <button
                                  onClick={() => handleDeleteUpozila(upozila._id)}
                                  disabled={deleteUpozilaMutation.isLoading}
                                  className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors hover:bg-red-50 px-3 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete"
                                >
                                  <FaTrash className="w-4 h-4" />
                                  
                                </button>
                                
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredUpozilas.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No upozilas found.{" "}
                        {selectedDistrict
                          ? "Try selecting a different district."
                          : "Add your first upozila above."}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
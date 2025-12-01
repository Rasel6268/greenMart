"use client";
import { useAuth } from "@/Hooks/useAuth";
import instance from "@/lib/instance";
import { useQuery, useQueryClient,useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();
   const queryClient = useQueryClient();
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    joinDate: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await instance.get(`/users?email=${user.email}`);
      return res.data.userData;
    },
    enabled: !!user,
  });

  // Update local state when data is fetched
  useEffect(() => {
    if (data) {
      setUserData({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        street: data.street || "",
        city: data.city || "",
        zipCode: data.zipCode || "",
        joinDate: data.createdAt
          ? new Date(data.createdAt).toLocaleDateString()
          : "N/A",
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await instance.put(`/users/${user.email}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["profile", user?.email] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    },
  });

  const handleSaveChanges = async () => {
    try {
      updateMutation.mutate(userData);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={userData.fullName}
              onChange={(e) =>
                setUserData({ ...userData, fullName: e.target.value })
              }
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) =>
                setUserData({ ...userData, email: e.target.value })
              }
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member Since
            </label>
            <input
              type="text"
              value={userData.joinDate}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street
            </label>
            <input
              type="text"
              value={userData.street}
              onChange={(e) =>
                setUserData({ ...userData, street: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={userData.city}
              onChange={(e) =>
                setUserData({ ...userData, city: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={userData.zipCode}
              onChange={(e) =>
                setUserData({ ...userData, zipCode: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSaveChanges}
          className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;

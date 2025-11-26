"use client";
import { useAuth } from "@/Hooks/useAuth";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { userLogin, googleLogin, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const redirectPath = sessionStorage.getItem("redirectPath") || "/profile";
      sessionStorage.removeItem("redirectPath");
      router.push(redirectPath);
    }
  }, [user, router]);

  const LoginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    
    if (email && password) {
      try {
        await userLogin(email, password);
        toast.success("Login successful! Welcome back to GreenMart 🌱");
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed! Please check your credentials.");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      const result = await googleLogin();
      const user = result.user;

      // Prepare user data for backend (matching your register structure)
      const userData = {
        uid: user.uid,
        fullName: user.displayName || "Google User",
        email: user.email,
        phone: "", // Google doesn't provide phone
        street: "",
        city: "",
        zipCode: "",
        photoURL: user.photoURL || "",
        provider: "google",
        emailVerified: user.emailVerified
      };

      try {
        // Try to create or update user in backend
        const token = await user.getIdToken();
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/users`,
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        if (res.data.success) {
          toast.success("Google login successful! Welcome to GreenMart 🎉");
        }
      } catch (backendError) {
        // If user already exists (409 conflict), it's fine - just log them in
        if (backendError.response?.status === 409) {
          toast.success("Welcome back to GreenMart! 🌱");
        } else {
          console.error("Backend error during Google login:", backendError);
          // Don't show error toast for existing users, just continue login
          toast.success("Welcome to GreenMart! 🌱");
        }
      }

    } catch (error) {
      console.error("Google login error:", error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        toast.info("Google login cancelled");
      } else if (error.code === 'auth/network-request-failed') {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "Google login failed!");
      }
    }
    setGoogleLoading(false);
  };

  return (
    <div className="min-h-screen from-emerald-50 to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-green-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to your eco-friendly account
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-6 shadow-sm"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={LoginHandler} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-green-600 hover:text-green-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {loading ? "Signing in..." : "Sign in to GreenMart"}
            </button>
          </form>

          {/* Sign up link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              New to GreenMart?{" "}
              <Link
                href="/user/register"
                className="text-green-600 hover:text-green-500 font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 GreenMart. Eco-friendly shopping for a better tomorrow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
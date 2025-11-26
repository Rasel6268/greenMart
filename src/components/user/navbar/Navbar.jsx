"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  IoIosMenu,
  IoIosClose,
} from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaRegHeart } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import Link from "next/link";
import {
  UserRoundPlus,
  LogIn,
  House,
  ShoppingBag,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  const userModelRef = useRef(null);
  const { user,userLogout } = useAuth();
  const { cart } = useCart();
  
  const isAuth = !!user;

  // Close user model when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userModelRef.current && !userModelRef.current.contains(event.target)) {
        setOpenUserModel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const openUser = () => {
    setOpenUserModel(!openUserModel);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };
  const LogoutHandler = () => {
     userLogout()
     toast.info('Logout success')
  }

  return (
    <section className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2 px-4">
        <div className="w-11/12 mx-auto text-center text-sm font-medium">
          🚀 Free Shipping on Orders Over $50 | 🔥 Hot Deals Live Now!
        </div>
      </div>

      <div className="w-11/12 mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">GM</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  GreenMart
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Premium Shopping
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center justify-center">
            <ul className="flex items-center justify-center gap-8 font-medium">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 flex items-center gap-1 group"
                >
                  <House className="w-4 h-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 flex items-center gap-1 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-700 hover:text-green-600 transition-colors duration-300 flex items-center gap-1 group"
                >
                  <span className="group-hover:scale-110 transition-transform">
                    <FcAbout className="w-4 h-4" />
                  </span>
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* Login/User */}
              {isAuth ? (
                <div ref={userModelRef} className="relative lg:flex cursor-pointer hidden">
                  <div className="w-12 h-12 border-4 border-green-500 rounded-full overflow-hidden hover:border-green-600 transition-colors cursor-pointer">
                    <button 
                      onClick={openUser} 
                      className="w-full h-full flex items-center justify-center bg-gray-100"
                    >
                      <img
                        src={user.avatar || "/user-avatar.jpg"}
                        alt="User Avatar"
                        className="w-full h-full object-cover cursor-pointer"
                      />
                    </button>
                  </div>

                  {openUserModel && (
                    <div className="absolute right-0 top-14 mt-2 bg-white w-72 z-50 shadow-xl rounded-xl border border-gray-200 overflow-hidden">
                      {/* User Header */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                            <img
                              src={user.avatar || "/user-avatar.jpg"}
                              alt="User Avatar"
                              className="w-full h-full object-cover"
                              
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="font-semibold text-gray-800 truncate">
                              {user.name || "John Doe"}
                            </h2>
                            <p className="text-sm text-gray-600 truncate">
                              {user.email || "john.doe@example.com"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                          onClick={() => setOpenUserModel(false)}
                        >
                          <User className="w-5 h-5 text-gray-400" />
                          <span>Dashboard</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>

                        <button onClick={LogoutHandler} className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 cursor-pointer">
                          <LogOut className="w-5 h-5" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center">
                  <Link
                    href="/user/login"
                    className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="user/register"
                    className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                  >
                    <UserRoundPlus className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              )}

              {/* Wishlist */}
              <Link href="/wishlist" className="relative">
                <FaRegHeart className="text-2xl text-gray-600 hover:text-red-500 transition-colors cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </Link>

              {/* Cart */}
              <Link href="/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-gray-600 hover:text-green-600 transition-colors cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cart?.length || 0}
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {isMenuOpen ? (
                  <IoIosClose className="text-2xl" />
                ) : (
                  <IoIosMenu className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-40">
            <div className="container mx-auto py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                  onClick={closeMobileMenu}
                >
                  <House className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                  onClick={closeMobileMenu}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop
                </Link>
                <Link
                  href="/about"
                  className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                  onClick={closeMobileMenu}
                >
                  <FcAbout className="w-4 h-4" />
                  About Us
                </Link>
              </div>
              
              {isAuth ? (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500">
                      <img
                        src={user.avatar || "/user-avatar.jpg"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                       
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {user.name || "John Doe"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user.email || "john.doe@example.com"}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                    onClick={closeMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button className="w-full mt-2 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col space-y-2">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-xl transition-colors flex items-center gap-3"
                    onClick={closeMobileMenu}
                  >
                    <UserRoundPlus className="w-4 h-4" />
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Navbar;
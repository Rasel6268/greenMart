"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosMenu, IoIosClose } from "react-icons/io";
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
import { useCart } from "@/Hooks/useCart";
import { useAuth } from "@/Hooks/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openUserModel, setOpenUserModel] = useState(false);
  const userModelRef = useRef(null);
  const { user, userLogout, isAdmin } = useAuth();
  const { cart } = useCart();

  const isAuth = !!user;

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userModelRef.current &&
        !userModelRef.current.contains(event.target)
      ) {
        setOpenUserModel(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleUserModel = () => setOpenUserModel(!openUserModel);
  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    userLogout();
    toast.info("Logout success");
    setOpenUserModel(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      {/* Announcement Bar */}
      <div className="bg-linear-to-r from-green-500 to-emerald-600 text-white py-2 px-4 text-center text-sm font-medium">
        🚀 Free Shipping on Orders Over $50 | 🔥 Hot Deals Live Now!
      </div>

      <div className="w-11/12 mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/icon.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-sm sm:text-base md:text-lg lg:text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            GreenStoreBD
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 font-medium">
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition"
          >
            <House className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition"
          >
            <ShoppingBag className="w-4 h-4" /> Shop
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-1 text-gray-700 hover:text-green-600 transition"
          >
            <FcAbout className="w-4 h-4" /> About
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link href="/wishlist" className="relative">
            <FaRegHeart className="text-2xl text-gray-600 hover:text-red-500 transition" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              3
            </span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <AiOutlineShoppingCart className="text-2xl text-gray-600 hover:text-green-600 transition" />
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cart?.length || 0}
            </span>
          </Link>

          {/* User Auth */}
          {isAuth ? (
            <div ref={userModelRef} className="relative hidden lg:flex">
              <button
                onClick={toggleUserModel}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-green-500 hover:border-green-600 transition"
              >
                <img
                  src={user?.photoURL || "/user-avatar.jpg"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {openUserModel && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden z-50">
                  <div className="bg-linear-to-r from-green-50 to-emerald-50 p-4 border-b border-gray-100 flex items-center gap-3">
                    <img
                      src={user?.photoURL || "/user-avatar.jpg"}
                      alt="User Avatar"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="truncate">
                      <h2 className="font-semibold text-gray-800 truncate">
                        {user?.name || user?.displayName || "John Doe"}
                      </h2>
                      <p className="text-sm text-gray-600 truncate">
                        {user?.email || "john.doe@example.com"}
                      </p>
                    </div>
                  </div>
                  <div className="py-2">
                    <Link
                      href={isAdmin ? "/dashboard" : "/profile"}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition"
                      onClick={() => setOpenUserModel(false)}
                    >
                      <User className="w-5 h-5 text-gray-400" />
                      {isAdmin ? "Dashboard" : "Profile"}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden lg:flex gap-2">
              <Link
                href="/user/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
              <Link
                href="/user/register"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
              >
                <UserRoundPlus className="w-4 h-4" /> Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          >
            {isMenuOpen ? (
              <IoIosClose className="text-2xl" />
            ) : (
              <IoIosMenu className="text-2xl" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-2xl border-t border-gray-200 absolute w-full z-40 left-0 top-full">
          <div className="flex flex-col gap-2 p-4">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50"
              onClick={toggleMobileMenu}
            >
              <House className="w-4 h-4" /> Home
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50"
              onClick={toggleMobileMenu}
            >
              <ShoppingBag className="w-4 h-4" /> Shop
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50"
              onClick={toggleMobileMenu}
            >
              <FcAbout className="w-4 h-4" /> About
            </Link>

            {isAuth ? (
              <div className="mt-2 border-t border-gray-200 pt-2 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-4 py-2">
                  <img
                    src={user?.photoURL}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {user?.name || user?.displayName || "John Doe"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {user?.email || "john.doe@example.com"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50"
                  onClick={toggleMobileMenu}
                >
                  <User className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-red-50 text-red-600"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="mt-2 border-t border-gray-200 pt-2 flex flex-col gap-2">
                <Link
                  href="/user/login"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50"
                  onClick={toggleMobileMenu}
                >
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link
                  href="/user/register"
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-green-50"
                  onClick={toggleMobileMenu}
                >
                  <UserRoundPlus className="w-4 h-4" /> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

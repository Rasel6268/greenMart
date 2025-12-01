// contexts/AuthContext.jsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import api from "@/lib/api";
import { AuthContext } from "./AuthContext";
import instance from "@/lib/instance";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

  // Register
  const userRegister = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };


  // Login
  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Login
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const userLogout = () => {
    setLoading(true);
    setAdmin(null);
    return signOut(auth);
  };

  // Check if user is admin
  const checkAdminStatus = async (email) => {
    if (!email) {
      setAdmin(null);
      return;
    }

    setAdminLoading(true);
    try {
      const response = await instance.get(`/users?email=${email}`);
      console.log(response.data)
      
      if (response.data.success && response.data.userData) {
        
        const userData = response.data.userData;
        const isUserAdmin = userData.userRole === 'admin';
        if (isUserAdmin) {
          setIsAdmin(isUserAdmin);
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    } catch (error) {
      console.error("Error checking admin status:", error);
      setAdmin(null);
    } finally {
      setAdminLoading(false);
    }
  };


  // Track logged-in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser?.email) {
        await checkAdminStatus(currentUser.email);
      } else {
        setAdmin(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const userData = {
    user,
    admin,
    loading,
    adminLoading,
    userRegister,
    userLogin,
    googleLogin,
    userLogout,
    checkAdminStatus,
    isAdmin,
  };

  return (
    <AuthContext value={userData}>
      {children}
    </AuthContext>
  );
};

export default AuthProvider



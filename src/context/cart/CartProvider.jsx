"use client";
import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { toast } from "react-toastify";

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ✅ Load cart from localStorage when the app loads
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    }
  }, []);

  // 💾 Save cart back to localStorage
  const saveCart = (cartItems) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
    setCart(cartItems);
  };

  // 🛒 Get current cart
  const getCart = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  };

  // 🟩 Add product (prevent duplicate)
  const addToCart = (productId, quantity) => {
    let existingCart = getCart();
    const existing = existingCart.find((item) => item.id === productId);

    if (existing) {
      return { success: false, message: "Product already exists in cart" };
    } else {
      existingCart.push({ id: productId, quantity });
      saveCart(existingCart);
      return { success: true, message: "Product added successfully" };
    }
  };

  // 🧩 Handle add with toast message
  const handleAddToCart = (productId, quantity, productName) => {
    const result = addToCart(productId, quantity);
    if (!result.success) {
      toast.info(result.message);
    } else {
      toast.success(`${productName} added to cart!`);
    }
  };

  // 🔄 Update quantity
  const updateCart = (productId, quantity) => {
    let existingCart = getCart();
    const product = existingCart.find((item) => item.id === productId);
    if (!product) return { success: false, message: "Product not found" };

    product.quantity = quantity;
    saveCart(existingCart);
    return { success: true, message: "Quantity updated" };
  };

  // 🗑️ Remove item
  const removeFromCart = (productId) => {
    const updatedCart = getCart().filter((item) => item.id !== productId);
    saveCart(updatedCart);
    toast.success("Product removed from cart!");
  };

  // 🧹 Clear all
  const clearCart = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("cart");
  }
  setCart([]);
  toast.info("Cart cleared");
};

  const data = {
    cart,
    setCart,
    getCart,
    saveCart,
    addToCart,
    handleAddToCart,
    updateCart,
    removeFromCart,
    clearCart,
  };

  
  return <CartContext value={data}>{children}</CartContext>;
};

export default CartProvider;

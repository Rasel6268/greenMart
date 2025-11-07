"use client";
import React, { useEffect, useState } from "react";
import { CartContext } from "./CartContext";
import { toast } from "react-toastify";

const CartProvider = ({ children }) => {
  const [cart,setCart] = useState([])
  function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }

  // 💾 Save cart back to localStorage
 const saveCart = (cart) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    setCart(cart);
  };

  // 🟩 Add a new product only if it's not already in the cart
  function addToCart(product,quantity) {
    let cart = getCart();
    const existing = cart.find((item) => item.id === product);
    if (existing) {
      return { success: false, message: "Product already exists in cart" };
    } else {
      cart.push({ id: product, quantity: quantity });
      saveCart(cart);
      return { success: true, message: "Product added successfully" };
    }
  }

  const handleAddToCart = (productId, quentity, productName) => {
      const result = addToCart(productId, quentity);
      if (result.success == false) {
        toast.info(result.message);
      } else if (result.success == true) {
        toast.success(`${productName} added to cart!`);
      }
    };

  // 🔄 Update quantity of a specific product
  function updateCart(productId, quantity) {
    let cart = getCart();
    const product = cart.find((item) => item.id === productId);

    if (!product) {
      console.log("❌ Product not found in cart");
      return { success: false, message: "Product not found" };
    }

    product.quantity = quantity;
    saveCart(cart);
    console.log(`♻️ Updated quantity of ${product.name} to ${quantity}`);
    return { success: true, message: "Quantity updated" };
  }

  // 🗑️ Remove specific product by ID
  function removeFromCart(productId) {
    let cart = getCart().filter((item) => item.id !== productId);
    saveCart(cart);
    console.log("🗑️ Product removed from cart");
  }

  // 🧹 Clear the entire cart
  function clearCart() {
    localStorage.removeItem("cart");
    console.log("🧹 Cart cleared");
  }

  const data = {
    getCart,
    addToCart,
    saveCart,
    cart,
    setCart,
    handleAddToCart
  };

  return <CartContext value={data}>{children}</CartContext>;
};

export default CartProvider;

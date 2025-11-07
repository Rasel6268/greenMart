import { CartContext } from "@/context/cart/CartContext";
import { useContext } from "react";

export const useCart = () => useContext(CartContext)
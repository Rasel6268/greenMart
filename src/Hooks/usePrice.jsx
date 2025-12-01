// usePrice.js
import { useCallback } from "react";

export const usePrice = () => {
  const getWholesalePrice = useCallback((product, quantity) => {
    if (!product.wholesalePricing || !Array.isArray(product.wholesalePricing)) {
      return { price: product.retailPrice, label: "Retail" };
    }

    const tier = product.wholesalePricing.find((t) => {
      const max = t.maxQty === null ? Infinity : t.maxQty;
      return quantity >= t.minQty && quantity <= max;
    });

    return tier
      ? { price: tier.price, label: tier.label }
      : { price: product.retailPrice, label: "Retail" };
  }, []);

  return { getWholesalePrice };
};

export default usePrice;

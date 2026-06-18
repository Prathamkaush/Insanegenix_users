"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { addToCart } from "@/lib/cart";
import { openAuthModal } from "@/lib/auth-modal";
import { Product } from "@/lib/products";
import { getCustomerToken } from "@/lib/wishlist";
import "./AddToCartButton.css";

export default function AddToCartButton({
  product,
  className = "ig-add-cart-btn",
  label,
  quantity = 1,
  variantId,
  sizeId,
}: {
  product: Product;
  className?: string;
  label?: string;
  quantity?: number;
  variantId?: number;
  sizeId?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const defaultVariant = product.variants?.find((variant) => variant.isDefault) || product.variants?.[0];

  const onClick = async () => {
    if (!getCustomerToken()) {
      openAuthModal("login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await addToCart(product.id, variantId ?? defaultVariant?.id, sizeId, quantity);
      setMessage("Added to cart");
      setIsAnimating(true);
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { delta: quantity } }));
      setTimeout(() => setIsAnimating(false), 600);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      if (errorMessage === "LOGIN_REQUIRED") {
        openAuthModal("login");
        return;
      }

      if (/select|flavour|size/i.test(errorMessage)) {
        window.location.href = `/product/${product.slug}`;
        return;
      }

      setMessage(errorMessage || "Could not add");
    } finally {
      setLoading(false);
      window.setTimeout(() => setMessage(""), 1800);
    }
  };

  return (
    <button
      type="button"
      className={`${className} ${isAnimating ? "is-animating" : ""}`}
      onClick={onClick}
      disabled={loading}
      aria-label={`Add ${product.title} to cart`}
      title={message || "Add to cart"}
    >
      {label ? (
        <span>{loading ? "Adding..." : message || label}</span>
      ) : (
        <>
          {message === "Added to cart" ? (
            <Check size={18} />
          ) : (
            <ShoppingCart size={18} />
          )}
        </>
      )}
    </button>
  );
}

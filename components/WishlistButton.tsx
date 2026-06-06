"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { openAuthModal } from "@/lib/auth-modal";
import { checkWishlist, getCustomerToken, toggleWishlist } from "@/lib/wishlist";
import "./WishlistButton.css";

export default function WishlistButton({
  productId,
  variantId,
  label = false,
  onWishedChange,
}: {
  productId: number;
  variantId?: number;
  label?: boolean;
  onWishedChange?: (wished: boolean) => void;
}) {
  const [wished, setWished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!getCustomerToken()) return;
    checkWishlist(productId, variantId)
      .then((res) => setWished(res.wished))
      .catch(() => undefined);
  }, [productId, variantId]);

  const onClick = async () => {
    if (!getCustomerToken()) {
      openAuthModal("login");
      return;
    }

    try {
      setLoading(true);
      setIsAnimating(true);
      const res = await toggleWishlist(productId, variantId);
      setWished(res.wished);
      onWishedChange?.(res.wished);
      window.dispatchEvent(new Event("wishlist:updated"));
      setTimeout(() => setIsAnimating(false), 600);
    } catch (error) {
      if (error instanceof Error && error.message === "LOGIN_REQUIRED") {
        openAuthModal("login");
      }
      setIsAnimating(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={`ig-wishlist-btn ${wished ? "is-active" : ""} ${label ? "has-label" : ""} ${isAnimating ? "is-animating" : ""}`}
      onClick={onClick}
      disabled={loading}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={18} fill={wished ? "currentColor" : "none"} />
      {label ? <span>{wished ? "Wishlisted" : "Wishlist"}</span> : null}
    </button>
  );
}

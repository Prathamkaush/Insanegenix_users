"use client";

import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import { Product } from "@/lib/products";

export default function ProductPurchaseControls({
  product,
  variantId,
  maxQuantity,
  inStock,
}: {
  product: Product;
  variantId?: number;
  maxQuantity: number;
  inStock: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const safeMaxQuantity = Math.max(1, maxQuantity || 1);

  const decrement = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increment = () => {
    setQuantity((current) => Math.min(safeMaxQuantity, current + 1));
  };

  return (
    <div className="eg-product-details__quantity d-flex align-items-center mb-30 mt-30">
      <h4 className="eg-product-details__quantity-title">Quantity</h4>
      <div className="eg-product-details__quantity-box">
        <button
          type="button"
          className="eg-product-details__quantity-btn minus decrement"
          onClick={decrement}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <i className="fa fa-minus" />
        </button>
        <span className="counter">{quantity}</span>
        <button
          type="button"
          className="eg-product-details__quantity-btn plus increment"
          onClick={increment}
          disabled={quantity >= safeMaxQuantity}
          aria-label="Increase quantity"
        >
          <i className="fa fa-plus" />
        </button>
      </div>
      <div className="eg-product-details__button">
        <AddToCartButton
          product={product}
          className="eg-btn ig-detail-cart-btn"
          label={inStock ? "Add to Cart" : "View Cart"}
          quantity={quantity}
          variantId={variantId}
        />
      </div>
      <WishlistButton productId={product.id} variantId={variantId} label />
    </div>
  );
}

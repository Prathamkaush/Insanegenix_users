"use client";

import { useMemo, useState } from "react";
import ProductPurchaseControls from "@/components/ProductPurchaseControls";
import {
  Product,
  ProductVariant,
  currency,
  getProductPricing,
} from "@/lib/products";

export default function ProductVariantPurchase({
  product,
  defaultVariantId,
}: {
  product: Product;
  defaultVariantId?: number;
}) {
  const variants = product.variants || [];
  const initialVariant =
    variants.find((variant) => variant.id === defaultVariantId) ||
    variants.find((variant) => variant.isDefault) ||
    variants[0] ||
    null;
  const [selectedVariantId, setSelectedVariantId] = useState<number | undefined>(initialVariant?.id);

  const selectedVariant = useMemo<ProductVariant | null>(
    () => variants.find((variant) => variant.id === selectedVariantId) || initialVariant,
    [initialVariant, selectedVariantId, variants],
  );
  const maxQuantity = Number(selectedVariant?.stock ?? product.stock ?? 0);
  const inStock = maxQuantity > 0;
  const { currentPrice, originalPrice, discountPercent } = getProductPricing(
    product,
    selectedVariant || undefined,
  );

  return (
    <>
      <div className="eg-product-details__price mt-30">
        <h4 className="eg-product-details__ammount">
          {originalPrice && originalPrice > currentPrice ? (
            <del className="old-ammount">{currency(originalPrice)}</del>
          ) : null}
          {currency(currentPrice)}
        </h4>
        {discountPercent && discountPercent > 0 ? (
          <span className="product-card__badge">{discountPercent}% off</span>
        ) : null}
      </div>

      {variants.length ? (
        <div className="ig-product-panel mt-30">
          <h4 className="eg-product-details__quantity-title mb-15">Available Options</h4>
          <div className="ig-variant-list">
            {variants.map((variant) => {
              const isActive = variant.id === selectedVariant?.id;

              return (
                <button
                  key={variant.id || variant.sku}
                  type="button"
                  className={`ig-variant-btn ${isActive ? "active" : ""}`}
                  onClick={() => setSelectedVariantId(variant.id)}
                  aria-pressed={isActive}
                >
                  <span>{variant.flavour || "Unflavoured"}</span>
                  {variant.weightLabel ? <small>{variant.weightLabel}</small> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <ProductPurchaseControls
        product={product}
        variantId={selectedVariant?.id}
        maxQuantity={maxQuantity}
        inStock={inStock}
      />
    </>
  );
}

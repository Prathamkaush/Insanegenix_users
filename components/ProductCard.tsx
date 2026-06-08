import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import { Product, currency, getProductPricing, productImage } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const defaultVariant = product.variants?.find((variant) => variant.isDefault) || product.variants?.[0];
  const { currentPrice, originalPrice, discountPercent } = getProductPricing(product, defaultVariant);
  const meta = defaultVariant?.weightLabel || defaultVariant?.flavour || product.goal || product.category?.name;
  const averageRating = Number(product.averageRating || 0);
  const reviewCount = Number(product.reviewCount || 0);

  return (
    <div className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card__image-wrapper">
        <img src={productImage(product)} alt={product.title} className="product-card__image" />
      </Link>

      <div className="product-card__content">
        <Link href={`/product/${product.slug}`} className="product-card__title-link">
          <h4 className="product-card__title">
          {product.title}
          </h4>
        </Link>

        {meta ? <p className="product-card__meta">{meta}</p> : null}

        <div className="product-card__rating" aria-label={`${averageRating.toFixed(1)} product rating`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= Math.round(averageRating) ? "active" : ""}>
              <img src="/assets/img/icon/rating-star.svg" alt="" />
            </span>
          ))}
          <small>{reviewCount ? `${averageRating.toFixed(1)} (${reviewCount})` : "No ratings"}</small>
        </div>

        <div className="product-card__price-row">
          <span className="product-card__price">{currency(currentPrice)}</span>
          {originalPrice ? (
            <>
              <span className="product-card__original-price">{currency(originalPrice)}</span>
              {discountPercent && discountPercent > 0 ? (
                <span className="product-card__badge">{discountPercent}% off</span>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="product-card__actions">
          <AddToCartButton product={product} className="product-card__cart-icon-btn" />
          <Link href={`/product/${product.slug}`} className="product-card__buy-btn">
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

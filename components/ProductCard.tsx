import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import { Product, currency, productImage } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const defaultVariant = product.variants?.find((variant) => variant.isDefault) || product.variants?.[0];
  const currentPrice = defaultVariant?.price ?? product.finalPrice ?? product.price ?? 0;
  const originalPrice =
    defaultVariant?.mrp ??
    product.originalPrice ??
    (product.price && Number(product.price) > Number(currentPrice) ? product.price : null);
  const discountPercent = originalPrice
    ? Math.round(((Number(originalPrice) - Number(currentPrice)) / Number(originalPrice)) * 100)
    : null;
  const meta = defaultVariant?.weightLabel || defaultVariant?.flavour || product.goal || product.category?.name;
  const averageRating = Number(product.averageRating || 0);
  const reviewCount = Number(product.reviewCount || 0);

  return (
    <div className="product-card">
      <Link
        href={`/product/${product.slug}`}
        className="product-card__cover-link"
        aria-label={`View ${product.title}`}
      />

      <div className="product-card__content">
        <h4 className="product-card__title">
          {product.title}
        </h4>

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

          <div className="buttons-row">
        <div className="product-card__actions">
          <AddToCartButton product={product} className="product-card__cart-btn" label="Add To Cart" />
        </div>

        <div className="product-card__wishlist">
          <WishlistButton productId={product.id} />
        </div>
        </div>
      </div>

      <div className="product-card__image-wrapper">
        <img src={productImage(product)} alt={product.title} className="product-card__image" />
      </div>
    </div>
  );
}

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import WishlistButton from "@/components/WishlistButton";
import { Product, currency, getProductPricing, productImage } from "@/lib/products";

export default function HomeProductCard({ product }: { product: Product }) {
  const defaultVariant =
    product.variants?.find((variant) => variant.isDefault) || product.variants?.[0];
  const { currentPrice, originalPrice } = getProductPricing(product, defaultVariant);
  const meta =
    product.category?.name ||
    product.type?.name ||
    defaultVariant?.weightLabel ||
    product.goal;

  return (
    <article className="home-product-card">
      <div className="home-product-card__content">
        <Link href={`/product/${product.slug}`} className="home-product-card__title-link">
          <h3 className="home-product-card__title">{product.title}</h3>
        </Link>

        {meta ? <p className="home-product-card__meta">{meta}</p> : null}

        <div className="home-product-card__prices">
          {originalPrice ? (
            <span className="home-product-card__original-price">
              {currency(originalPrice)}
            </span>
          ) : null}
          <span className="home-product-card__price">{currency(currentPrice)}</span>
        </div>

        <div className="home-product-card__actions">
          <Link href={`/product/${product.slug}`} className="home-product-card__shop">
            <ShoppingCart aria-hidden="true" size={21} strokeWidth={2.5} />
            <span>Shop Now</span>
          </Link>

          <div className="home-product-card__wishlist">
            <WishlistButton productId={product.id} variantId={defaultVariant?.id} />
          </div>
        </div>
      </div>

      <Link
        href={`/product/${product.slug}`}
        className="home-product-card__image-link"
        aria-label={`View ${product.title}`}
      >
        <img
          src={productImage(product)}
          alt={product.title}
          className="home-product-card__image"
        />
      </Link>
    </article>
  );
}

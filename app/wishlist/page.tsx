"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthActionButton from "@/components/AuthActionButton";
import Breadcrumb from "@/components/Breadcrumb";
import WishlistButton from "@/components/WishlistButton";
import { currency, productImage } from "@/lib/products";
import { getCustomerToken, getWishlist, WishlistItem } from "@/lib/wishlist";

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);

  const loadWishlist = async () => {
    if (!getCustomerToken()) {
      setLoginRequired(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getWishlist();
      setItems(data);
    } catch (error) {
      setLoginRequired(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  return (
    <main className="fix">
      <Breadcrumb title="Wishlist" />
      <section className="wishlist-area pt-120 pb-120">
        <div className="container">
          {loading ? (
            <div className="eg-review__box text-center">
              <h3>Loading wishlist...</h3>
            </div>
          ) : loginRequired ? (
            <div className="eg-review__box text-center">
              <h3>Login to view your wishlist</h3>
              <p>Save supplements and return to them whenever you are ready.</p>
              <AuthActionButton className="eg-btn mt-25">
                <span>Login</span>
              </AuthActionButton>
            </div>
          ) : items.length === 0 ? (
            <div className="eg-review__box text-center">
              <h3>Your wishlist is empty</h3>
              <p>Tap the heart on products you want to save.</p>
              <Link href="/shop" className="eg-btn mt-25">
                <span>Explore Supplements</span>
              </Link>
            </div>
          ) : (
            <div className="ig-wishlist-grid">
              {items.map((item) => (
                <article className="ig-wishlist-card" key={item.id}>
                  <Link href={`/product/${item.product.slug}`} className="ig-wishlist-card__image">
                    <img src={productImage(item.product)} alt={item.product.title} />
                  </Link>
                  <div className="ig-wishlist-card__body">
                    <span>{item.variant?.flavour || item.product.category?.name || "InsaneGenix"}</span>
                    <h3>
                      <Link href={`/product/${item.product.slug}`}>{item.product.title}</Link>
                    </h3>
                    {item.variant?.weightLabel ? <p>{item.variant.weightLabel}</p> : null}
                    <strong>{currency(item.variant?.price || item.product.finalPrice || item.product.price)}</strong>
                    <div className="ig-wishlist-card__actions">
                      <Link href={`/product/${item.product.slug}`} className="eg-btn">
                        <span>View Product</span>
                      </Link>
                      <WishlistButton
                        productId={item.productId}
                        variantId={item.variantId || undefined}
                        onWishedChange={(wished) => {
                          if (!wished) setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
                        }}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

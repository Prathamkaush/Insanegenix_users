"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import AuthActionButton from "@/components/AuthActionButton";
import Breadcrumb from "@/components/Breadcrumb";
import WishlistButton from "@/components/WishlistButton";
import { currency, getProductPricing, productImage } from "@/lib/products";
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
      <section className="wishlist-area">
        <div className="container">
          {loading ? (
            <div className="eg-review__box ig-empty-state text-center">
              <h3>Loading wishlist...</h3>
            </div>
          ) : loginRequired ? (
            <div className="eg-review__box ig-empty-state text-center">
              <h3>Login to view your wishlist</h3>
              <p>Save supplements and return to them whenever you are ready.</p>
              <AuthActionButton className="eg-btn mt-25">
                <span>Login</span>
              </AuthActionButton>
            </div>
          ) : items.length === 0 ? (
            <div className="eg-review__box ig-empty-state text-center">
              <h3>Your wishlist is empty</h3>
              <p>Tap the heart on products you want to save.</p>
              <Link href="/shop" className="eg-btn mt-25">
                <span>Explore Supplements</span>
              </Link>
            </div>
          ) : (
            <div className="ig-wishlist-shell">
              <div className="ig-wishlist-page-head">
                <div>
                  <span className="ig-wishlist-kicker">Saved for later</span>
                  <h1>Your wishlist</h1>
                  <p>
                    {items.length} saved product{items.length === 1 ? "" : "s"} ready when you are
                  </p>
                </div>
                <Link href="/shop" className="ig-wishlist-continue">
                  Explore products <ArrowRight size={16} />
                </Link>
              </div>

              <div className="ig-wishlist-grid">
                {items.map((item) => {
                  const pricing = getProductPricing(
                    item.product,
                    item.variant || undefined,
                  );

                  return (
                  <article className="ig-wishlist-card" key={item.id}>
                    <div className="ig-wishlist-card__media">
                      <Link href={`/product/${item.product.slug}`} className="ig-wishlist-card__image">
                        <img src={productImage(item.product)} alt={item.product.title} />
                      </Link>
                      <div className="ig-wishlist-card__remove">
                        <WishlistButton
                          productId={item.productId}
                          variantId={item.variantId || undefined}
                          onWishedChange={(wished) => {
                            if (!wished) setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
                          }}
                        />
                      </div>
                    </div>

                    <div className="ig-wishlist-card__body">
                      <span>{item.variant?.flavour || item.product.category?.name || "InsaneGenix"}</span>
                      <h3>
                        <Link href={`/product/${item.product.slug}`}>{item.product.title}</Link>
                      </h3>
                      <p>{item.variant?.weightLabel || "Select your preferred option"}</p>
                      <div className="ig-wishlist-card__price">
                        <small>From</small>
                        <strong>{currency(pricing.currentPrice)}</strong>
                        {pricing.originalPrice ? (
                          <del>{currency(pricing.originalPrice)}</del>
                        ) : null}
                      </div>
                      <Link href={`/product/${item.product.slug}`} className="ig-wishlist-view ig-primary-action">
                        View product <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                  );
                })}
              </div>

              <div className="ig-wishlist-footnote">
                <Heart size={15} />
                Saved products remain here while you are signed in.
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

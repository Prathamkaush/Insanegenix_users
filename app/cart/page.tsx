"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShieldCheck, ShoppingBag, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import AuthActionButton from "@/components/AuthActionButton";
import {
  cartItemGstRate,
  cartItemGstTotal,
  cartItemPayableTotal,
  cartItemSubtotal,
  getCart,
  getCustomerToken,
  removeCartItem,
  updateCartItem,
  CartItem,
} from "@/lib/cart";
import { currency, productImage } from "@/lib/products";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<number | null>(null);
  const [cartError, setCartError] = useState("");

  const loadCart = async () => {
    if (!getCustomerToken()) {
      setLoginRequired(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getCart();
      setItems(data.items || []);
      setLoginRequired(false);
    } catch {
      setLoginRequired(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();

    const handleCartUpdated = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string }>).detail;
      if (detail?.source !== "cart-page") loadCart();
    };

    window.addEventListener("cart:updated", handleCartUpdated);
    return () => window.removeEventListener("cart:updated", handleCartUpdated);
  }, []);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + cartItemSubtotal(item), 0), [items]);
  const gstTotal = useMemo(() => items.reduce((sum, item) => sum + cartItemGstTotal(item), 0), [items]);
  const total = subtotal + gstTotal;
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const notifyCartCount = (count: number) => {
    window.dispatchEvent(new CustomEvent("cart:updated", {
      detail: { count, source: "cart-page" },
    }));
  };

  const changeQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1 || pendingItemId !== null) return;

    try {
      setPendingItemId(item.id);
      setCartError("");
      await updateCartItem(item.id, quantity);
      setItems((current) => current.map((currentItem) => (
        currentItem.id === item.id ? { ...currentItem, quantity } : currentItem
      )));
      notifyCartCount(itemCount - item.quantity + quantity);
    } catch (error) {
      setCartError(error instanceof Error ? error.message : "Could not update the cart quantity.");
    } finally {
      setPendingItemId(null);
    }
  };

  const removeItem = async (item: CartItem) => {
    if (pendingItemId !== null) return;

    try {
      setPendingItemId(item.id);
      setCartError("");
      await removeCartItem(item.id);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      notifyCartCount(Math.max(0, itemCount - item.quantity));
    } catch (error) {
      setCartError(error instanceof Error ? error.message : "Could not remove this product.");
    } finally {
      setPendingItemId(null);
    }
  };

  return (
    <main className="fix">
      <Breadcrumb title="Cart" />
      <section className="cart-area">
        <div className="container mt-25">
          {loading ? (
            <div className="eg-review__box ig-empty-state text-center">
              <h3>Loading cart...</h3>
            </div>
          ) : loginRequired ? (
            <div className="eg-review__box ig-empty-state text-center">
              <h3>Login to view your cart</h3>
              <p>Add products after signing in to keep them saved.</p>
              <AuthActionButton className="eg-btn mt-25">
                <span>Login</span>
              </AuthActionButton>
            </div>
          ) : items.length === 0 ? (
            <div className="eg-review__box ig-empty-state text-center">
              <h3>Your cart is empty</h3>
              <p>Pick your supplements and they will appear here.</p>
              <Link href="/shop" className="eg-btn mt-25">
                <span>Continue Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="ig-cart-shell">
              <div className="ig-cart-page-head">
                <div>
                  <span className="ig-cart-kicker">Your selection</span>
                  <h1>Shopping cart</h1>
                  <p>
                    {itemCount} item{itemCount === 1 ? "" : "s"} ready for checkout
                  </p>
                </div>
                <Link href="/shop" className="ig-cart-continue">
                  Continue shopping <ArrowRight size={16} />
                </Link>
              </div>

              <div className="ig-cart-layout">
                <div className="ig-cart-table-wrap">
                  {cartError ? (
                    <p className="ig-cart-error" role="alert">{cartError}</p>
                  ) : null}
                  <div className="ig-cart-table" role="table" aria-label="Shopping cart">
                    <div className="ig-cart-row ig-cart-row--head" role="row">
                      <span role="columnheader">Product</span>
                      <span role="columnheader">Price</span>
                      <span role="columnheader">GST</span>
                      <span role="columnheader">Quantity</span>
                      <span role="columnheader">Total</span>
                      <span role="columnheader" className="sr-only">Remove</span>
                    </div>
                    {items.map((item) => (
                      <div className="ig-cart-row" role="row" key={item.id}>
                        <div className="ig-cart-product" role="cell">
                          <Link href={`/product/${item.product.slug || item.product.id}`} className="ig-cart-product__image">
                            <img src={productImage(item.product)} alt={item.product.title} />
                          </Link>
                          <div className="ig-cart-product__copy">
                            <span className="ig-cart-product__tag">In your cart</span>
                            <h3>
                              <Link href={`/product/${item.product.slug || item.product.id}`}>
                                {item.product.title}
                              </Link>
                            </h3>
                            <p>{[item.variant?.flavour, item.variant?.weightLabel, item.size?.size].filter(Boolean).join(" / ") || "Standard option"}</p>
                          </div>
                        </div>
                        <strong className="ig-cart-price" role="cell">{currency(item.price)}</strong>
                        <div className="ig-cart-gst" role="cell">
                          <span className="ig-cart-gst__value">
                            {currency(cartItemGstTotal(item))}
                            {cartItemGstRate(item) > 0 && <small>{cartItemGstRate(item)}% GST</small>}
                          </span>
                        </div>
                        <div className="ig-cart-quantity" role="cell">
                          <span className="ig-cart-mobile-label">Quantity</span>
                          <div className="ig-cart-stepper">
                            <button
                              type="button"
                              aria-label={`Decrease ${item.product.title} quantity`}
                              onClick={() => changeQuantity(item, item.quantity - 1)}
                              disabled={item.quantity <= 1 || pendingItemId !== null}
                            >
                              <Minus size={14} />
                            </button>
                            <span aria-live="polite">
                              {pendingItemId === item.id ? "..." : item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase ${item.product.title} quantity`}
                              onClick={() => changeQuantity(item, item.quantity + 1)}
                              disabled={pendingItemId !== null}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <strong className="ig-cart-line-total" role="cell">{currency(cartItemPayableTotal(item))}</strong>
                        <button
                          type="button"
                          className="ig-cart-remove"
                          aria-label={`Remove ${item.product.title}`}
                          onClick={() => removeItem(item)}
                          disabled={pendingItemId !== null}
                          role="cell"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <aside className="ig-cart-summary">
                  <div className="ig-cart-summary__head">
                    <span><ShoppingBag size={17} /> Order summary</span>
                    <small>{itemCount} item{itemCount === 1 ? "" : "s"}</small>
                  </div>
                  <div className="ig-cart-summary__line">
                    <span>Subtotal</span>
                    <strong>{currency(subtotal)}</strong>
                  </div>
                  <div className="ig-cart-summary__line">
                    <span>GST</span>
                    <strong>{currency(gstTotal)}</strong>
                  </div>
                  <div className="ig-cart-summary__line ig-cart-summary__line--total">
                    <span>Total</span>
                    <strong>{currency(total)}</strong>
                  </div>
                  <Link href="/checkout" className="ig-cart-checkout ig-primary-action">
                    Proceed to checkout <ArrowRight size={17} />
                  </Link>
                  <p className="ig-cart-secure">
                    <ShieldCheck size={16} />
                    Secure checkout and protected payment
                  </p>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

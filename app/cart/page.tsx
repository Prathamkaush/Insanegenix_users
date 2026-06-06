"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import AuthActionButton from "@/components/AuthActionButton";
import { getCart, getCustomerToken, removeCartItem, updateCartItem, CartItem } from "@/lib/cart";
import { currency, productImage } from "@/lib/products";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(false);

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
    window.addEventListener("cart:updated", loadCart);
    return () => window.removeEventListener("cart:updated", loadCart);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [items]
  );

  const changeQuantity = async (item: CartItem, quantity: number) => {
    if (quantity < 1) return;
    await updateCartItem(item.id, quantity);
    setItems((current) =>
      current.map((currentItem) => (currentItem.id === item.id ? { ...currentItem, quantity } : currentItem))
    );
  };

  const removeItem = async (id: number) => {
    await removeCartItem(id);
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <main className="fix">
      <Breadcrumb title="Cart" />
      <section className="cart-area pt-120 pb-120">
        <div className="container">
          {loading ? (
            <div className="eg-review__box text-center">
              <h3>Loading cart...</h3>
            </div>
          ) : loginRequired ? (
            <div className="eg-review__box text-center">
              <h3>Login to view your cart</h3>
              <p>Add products after signing in to keep them saved.</p>
              <AuthActionButton className="eg-btn mt-25">
                <span>Login</span>
              </AuthActionButton>
            </div>
          ) : items.length === 0 ? (
            <div className="eg-review__box text-center">
              <h3>Your cart is empty</h3>
              <p>Pick your supplements and they will appear here.</p>
              <Link href="/shop" className="eg-btn mt-25">
                <span>Continue Shopping</span>
              </Link>
            </div>
          ) : (
            <div className="ig-cart-layout">
              <div className="ig-cart-list">
                {items.map((item) => (
                  <article className="ig-cart-item" key={item.id}>
                    <Link href={`/product/${item.product.slug || item.product.id}`} className="ig-cart-item__image">
                      <img src={productImage(item.product)} alt={item.product.title} />
                    </Link>
                    <div className="ig-cart-item__body">
                      <h3>{item.product.title}</h3>
                      <p>{[item.variant?.flavour, item.variant?.weightLabel, item.size?.size].filter(Boolean).join(" / ")}</p>
                      <strong>{currency(item.price)}</strong>
                      <div className="ig-cart-item__actions">
                        <button type="button" onClick={() => changeQuantity(item, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item, item.quantity + 1)}>+</button>
                        <button type="button" className="ig-cart-remove" onClick={() => removeItem(item.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <aside className="ig-cart-summary">
                <span>Total</span>
                <strong>{currency(total)}</strong>
                <Link href="/checkout" className="eg-btn mb-15 text-center d-block">
                  <span>Proceed to Checkout</span>
                </Link>
                <Link href="/shop" className="eg-btn text-center d-block" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.15)", color: "#fff" }}>
                  <span>Continue Shopping</span>
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

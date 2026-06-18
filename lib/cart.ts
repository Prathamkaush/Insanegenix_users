import { Product, getProductPricing } from "@/lib/products";
import { getCustomerToken } from "@/lib/wishlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";
const GUEST_CART_KEY = "ig_guest_cart";

export { getCustomerToken };

export type CartItem = {
  id: number;
  quantity: number;
  price: string | number;
  gstRate?: string | number | null;
  gstAmount?: string | number | null;
  weight?: string | number | null;
  product: Pick<Product, "id" | "title" | "img1"> & { slug?: string | null };
  variant?: {
    id: number;
    sku?: string | null;
    flavour?: string | null;
    weightLabel?: string | null;
    image1?: string | null;
  } | null;
  size?: {
    id: number;
    size: string;
  } | null;
};

type GuestCartItem = CartItem & {
  productId: number;
  variantId?: number;
  sizeId?: number;
};

let syncPromise: Promise<void> | null = null;

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readGuestCart(): GuestCartItem[] {
  if (!canUseStorage()) return [];

  try {
    const rawCart = localStorage.getItem(GUEST_CART_KEY);
    if (!rawCart) return [];

    const parsedCart = JSON.parse(rawCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: GuestCartItem[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function clearGuestCart() {
  if (!canUseStorage()) return;
  localStorage.removeItem(GUEST_CART_KEY);
}

function getVariant(product?: Product, variantId?: number) {
  if (!product) return undefined;

  return product.variants?.find((variant) => variant.id === variantId)
    || product.variants?.find((variant) => variant.isDefault)
    || product.variants?.[0];
}

function getSize(product?: Product, sizeId?: number) {
  if (!product || !sizeId) return undefined;
  return product.sizes?.find((size) => size.id === sizeId);
}

function addGuestCartItem(
  productId: number,
  variantId?: number,
  sizeId?: number,
  quantity: number = 1,
  product?: Product,
) {
  if (!product) throw new Error("PRODUCT_REQUIRED");

  const items = readGuestCart();
  const variant = getVariant(product, variantId);
  const size = getSize(product, sizeId);
  const resolvedVariantId = variant?.id || variantId;
  const resolvedSizeId = size?.id || sizeId;

  const existingItem = items.find((item) => (
    item.productId === productId
    && (item.variantId || null) === (resolvedVariantId || null)
    && (item.sizeId || null) === (resolvedSizeId || null)
  ));

  if (existingItem) {
    existingItem.quantity += quantity;
    writeGuestCart(items);
    return { items, guest: true };
  }

  const pricing = getProductPricing(product, variant);
  const guestItem: GuestCartItem = {
    id: -Date.now(),
    productId,
    variantId: resolvedVariantId,
    sizeId: resolvedSizeId,
    quantity,
    price: pricing.currentPrice,
    gstRate: product.gstRate || 0,
    product: {
      id: product.id,
      title: product.title,
      slug: product.slug,
      img1: variant?.image1 || product.img1,
    },
    variant: variant?.id ? {
      id: variant.id,
      sku: variant.sku,
      flavour: variant.flavour,
      weightLabel: variant.weightLabel,
      image1: variant.image1,
    } : null,
    size: size?.id ? {
      id: size.id,
      size: size.size,
    } : null,
  };

  const nextItems = [...items, guestItem];
  writeGuestCart(nextItems);
  return { items: nextItems, guest: true };
}

async function cartRequest(path: string, init?: RequestInit) {
  const token = getCustomerToken();
  if (!token) throw new Error("LOGIN_REQUIRED");

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  if (res.status === 401) throw new Error("LOGIN_REQUIRED");

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "CART_REQUEST_FAILED");
  }

  return data;
}

function addToServerCart(productId: number, variantId?: number, sizeId?: number, quantity: number = 1) {
  return cartRequest("/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, variantId, sizeId, quantity }),
  });
}

export async function syncGuestCartToServer() {
  if (!getCustomerToken()) return;
  if (syncPromise) return syncPromise;

  syncPromise = (async () => {
    const guestItems = readGuestCart();
    if (!guestItems.length) return;

    for (const item of guestItems) {
      await addToServerCart(item.productId, item.variantId, item.sizeId, item.quantity);
    }

    clearGuestCart();
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { source: "guest-cart-sync" } }));
  })().finally(() => {
    syncPromise = null;
  });

  return syncPromise;
}

export async function getCart(): Promise<{ items: CartItem[] }> {
  if (!getCustomerToken()) {
    return { items: readGuestCart() };
  }

  await syncGuestCartToServer();
  return cartRequest("/cart");
}

export function getGuestCartItemCount() {
  return readGuestCart().reduce((sum, item) => sum + item.quantity, 0);
}

export async function addToCart(
  productId: number,
  variantId?: number,
  sizeId?: number,
  quantity: number = 1,
  product?: Product,
) {
  if (!getCustomerToken()) {
    return addGuestCartItem(productId, variantId, sizeId, quantity, product);
  }

  await syncGuestCartToServer();
  return addToServerCart(productId, variantId, sizeId, quantity);
}

export function updateCartItem(id: number, quantity: number) {
  if (!getCustomerToken()) {
    const items = readGuestCart().map((item) => (
      item.id === id ? { ...item, quantity } : item
    ));
    writeGuestCart(items);
    return Promise.resolve({ items, guest: true });
  }

  return cartRequest(`/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id: number) {
  if (!getCustomerToken()) {
    const items = readGuestCart().filter((item) => item.id !== id);
    writeGuestCart(items);
    return Promise.resolve({ items, guest: true });
  }

  return cartRequest(`/cart/${id}`, {
    method: "DELETE",
  });
}

export function cartItemSubtotal(item: CartItem) {
  return Number(item.price || 0) * item.quantity;
}

export function cartItemGstRate(item: CartItem) {
  return Number(item.gstRate || 0);
}

export function cartItemUnitGst(item: CartItem) {
  const configuredGst = Number(item.gstAmount || 0);
  if (configuredGst > 0) return configuredGst;

  const rate = cartItemGstRate(item);
  if (rate <= 0) return 0;

  return (Number(item.price || 0) * rate) / 100;
}

export function cartItemGstTotal(item: CartItem) {
  return cartItemUnitGst(item) * item.quantity;
}

export function cartItemPayableTotal(item: CartItem) {
  return cartItemSubtotal(item) + cartItemGstTotal(item);
}

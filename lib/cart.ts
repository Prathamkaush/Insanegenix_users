import { Product } from "@/lib/products";
import { getCustomerToken } from "@/lib/wishlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

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

export function getCart(): Promise<{ items: CartItem[] }> {
  return cartRequest("/cart");
}

export function addToCart(productId: number, variantId?: number, sizeId?: number, quantity: number = 1) {
  return cartRequest("/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId, variantId, sizeId, quantity }),
  });
}

export function updateCartItem(id: number, quantity: number) {
  return cartRequest(`/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(id: number) {
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

import { Product } from "@/lib/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export type WishlistItem = {
  id: number;
  productId: number;
  variantId?: number | null;
  createdAt?: string;
  product: Product;
  variant?: {
    id: number;
    sku?: string | null;
    flavour?: string | null;
    weightLabel?: string | null;
    price?: string | number | null;
    stock?: number | null;
    image1?: string | null;
  } | null;
};

export function getCustomerToken() {
  if (typeof window === "undefined") return "";

  const cookieToken = document.cookie
    .split("; ")
    .map((item) => item.split("="))
    .find(([key]) => ["token", "user_token", "access_token", "auth_token"].includes(key))?.[1];

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("user_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    (cookieToken ? decodeURIComponent(cookieToken) : "") ||
    ""
  );
}

async function wishlistRequest(path: string, init?: RequestInit) {
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
  if (!res.ok) throw new Error("WISHLIST_REQUEST_FAILED");
  return res.json();
}

export function getWishlist(): Promise<WishlistItem[]> {
  return wishlistRequest("/wishlist");
}

export function toggleWishlist(productId: number, variantId?: number) {
  return wishlistRequest("/wishlist/toggle", {
    method: "POST",
    body: JSON.stringify({ productId, variantId }),
  }) as Promise<{ wished: boolean }>;
}

export function checkWishlist(productId: number, variantId?: number) {
  const params = new URLSearchParams({ productId: String(productId) });
  if (variantId) params.set("variantId", String(variantId));
  return wishlistRequest(`/wishlist/check?${params.toString()}`) as Promise<{
    wished: boolean;
    productId: number;
    variantId: number | null;
  }>;
}

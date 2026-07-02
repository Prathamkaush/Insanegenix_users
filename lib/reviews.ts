import { getCustomerToken } from "@/lib/wishlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export type ProductReview = {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    name?: string | null;
  };
  product?: {
    id: number;
    title: string;
    slug?: string | null;
    img1?: string | null;
  };
};

export async function getProductReviews(productId: number): Promise<{
  averageRating: number;
  total: number;
  reviews: ProductReview[];
}> {
  const res = await fetch(`${API_URL}/reviews/product/${productId}`, { cache: "no-store" });
  if (!res.ok) return { averageRating: 0, total: 0, reviews: [] };
  return res.json();
}

export async function submitProductReview(productId: number, rating: number, comment: string) {
  const token = getCustomerToken();
  if (!token) throw new Error("LOGIN_REQUIRED");

  const res = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, rating, comment }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Unable to submit review");
  return data;
}

export async function getLatestReviews(limit?: number): Promise<ProductReview[]> {
  try {
    const query = typeof limit === "number" ? `?limit=${limit}` : "";
    const res = await fetch(`${API_URL}/reviews/latest${query}`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

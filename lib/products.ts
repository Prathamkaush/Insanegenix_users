export type ProductVariant = {
  id?: number;
  sku?: string | null;
  flavour?: string | null;
  weightLabel?: string | null;
  netQuantity?: string | null;
  servings?: number | null;
  mrp?: string | number | null;
  price?: string | number | null;
  discountType?: string | null;
  discountValue?: string | number | null;
  stock?: number;
  isDefault?: boolean;
  status?: string | null;
  image1?: string | null;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  originalPrice?: string | number | null;
  price?: string | number | null;
  discountType?: string | null;
  discountValue?: string | number | null;
  gstRate?: string | number | null;
  finalPrice?: string | number | null;
  averageRating?: string | number | null;
  reviewCount?: string | number | null;
  stock?: number;
  goal?: string | null;
  brandName?: string | null;
  productLine?: string | null;
  dietaryPreference?: string | null;
  proteinType?: string | null;
  servingSize?: string | null;
  servingsPerContainer?: string | number | null;
  proteinPerServing?: string | number | null;
  bcaaPerServing?: string | number | null;
  eaaPerServing?: string | number | null;
  caloriesPerServing?: string | number | null;
  proteinPercentage?: string | number | null;
  ingredients?: string | null;
  howToUse?: string | null;
  whenToUse?: string | null;
  safetyInformation?: string | null;
  allergenInfo?: string | null;
  fssaiLicense?: string | null;
  countryOfOrigin?: string | null;
  marketedBy?: string | null;
  manufacturedBy?: string | null;
  sellerName?: string | null;
  authenticityNote?: string | null;
  returnPolicy?: string | null;
  freeShipping?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewLaunch?: boolean;
  weight?: string | number | null;
  estimatedShipping?: string | null;
  img1?: string | null;
  img2?: string | null;
  img3?: string | null;
  img4?: string | null;
  category?: { name?: string };
  type?: { name?: string };
  variants?: ProductVariant[];
  sizes?: Array<{ id?: number; size: string; stock?: number; price?: string | number | null }>;
  nutritionFacts?: Array<{ name: string; amount: string | number; unit?: string | null; per?: string | null }>;
  keyBenefits?: string[];
  certifications?: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export const fallbackProducts: Product[] = [
  { id: 1, title: "Creatine", slug: "creatine", price: 1104, finalPrice: 1104, img1: "Creatine.png", goal: "Muscle", stock: 20 },
  { id: 2, title: "D3 + K2 Omega 3", slug: "d3-k2-omega-3", price: 1380, finalPrice: 1380, img1: "D3-K2.png", goal: "Wellness", stock: 20 },
  { id: 3, title: "Dart", slug: "dart", price: 2944, finalPrice: 2944, img1: "Dart.png", goal: "Pre Workout", stock: 20 },
  { id: 4, title: "EAA", slug: "eaa", price: 3220, finalPrice: 3220, img1: "EAA.png", goal: "Recovery", stock: 20 },
  { id: 5, title: "ISO", slug: "iso", price: 14168, finalPrice: 14168, img1: "ISO.png", goal: "Lean Muscle", stock: 20 },
  { id: 6, title: "Mass Gainer", slug: "mass-gainer", price: 6992, finalPrice: 6992, img1: "Mass-Gainer.png", goal: "Mass Gain", stock: 20 },
  { id: 7, title: "Whey", slug: "whey", price: 10028, finalPrice: 10028, img1: "Whey.png", goal: "Protein", stock: 20 },
];

export async function getProducts(params?: { categoryId?: string | number }): Promise<Product[]> {
  try {
    const searchParams = new URLSearchParams({ limit: "24" });
    if (params?.categoryId) {
      searchParams.set("categoryId", String(params.categoryId));
    }

    const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, { cache: "no-store" });
    if (!res.ok) return fallbackProducts;
    const data = await res.json();
    const products = Array.isArray(data) ? data : data.products || data.data?.products || data.data;
    return products?.length ? products : fallbackProducts;
  } catch {
    return fallbackProducts;
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      return data.product || data;
    }
  } catch {}

  return fallbackProducts.find((product) => product.slug === slug) || null;
}

export function productImage(
  product: Pick<Product, "img1" | "img2" | "img3" | "img4">,
  imageKey: "img1" | "img2" | "img3" | "img4" = "img1"
) {
  const image = product[imageKey] || product.img1;
  if (!image) return "/assets/img/product/Whey.png";
  if (String(image).startsWith("http")) return String(image);
  if (String(image).startsWith("/")) return String(image);
  if (!fallbackProducts.some((item) => item.img1 === image)) return `${API_URL}/uploads/products/${image}`;
  return `/assets/img/product/${image}`;
}

export function getProductPricing(product: Product, variant?: ProductVariant) {
  const basePrice = Number(variant?.price ?? product.price ?? 0);
  const discountType = variant?.discountType ?? product.discountType;
  const discountValue = Number(variant?.discountValue ?? product.discountValue ?? 0);
  let currentPrice = basePrice;

  if (discountType === "PERCENT" && discountValue > 0) {
    currentPrice = Math.max(0, Math.round(basePrice - (basePrice * discountValue) / 100));
  } else if (discountType === "FLAT" && discountValue > 0) {
    currentPrice = Math.max(0, Math.round(basePrice - discountValue));
  }

  const configuredMrp = Number(variant?.mrp ?? product.originalPrice ?? 0);
  const originalPrice =
    currentPrice < basePrice
      ? basePrice
      : configuredMrp > currentPrice
        ? configuredMrp
        : null;
  const discountPercent = originalPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  return {
    currentPrice,
    originalPrice,
    discountPercent,
  };
}

export function currency(value?: string | number | null) {
  return `₹${Number(value || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

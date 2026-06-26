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
  image2?: string | null;
  image3?: string | null;
  image4?: string | null;
  image5?: string | null;
  image6?: string | null;
  video?: string | null;
};

export type Product = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
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
  dietaryType?: "UNSPECIFIED" | "VEGETARIAN" | "NON_VEGETARIAN" | "VEGAN" | null;
  tags?: string[];
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
  img5?: string | null;
  img6?: string | null;
  video?: string | null;
  category?: { id?: number; name?: string };
  type?: { name?: string };
  variants?: ProductVariant[];
  sizes?: Array<{ id?: number; size: string; stock?: number; price?: string | number | null }>;
  nutritionFacts?: Array<{ name: string; amount: string | number; unit?: string | null; per?: string | null }>;
  keyBenefits?: string[];
  certifications?: string[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

const bundledProductImages = new Set([
  "Creatine.png",
  "D3-K2.png",
  "Dart.png",
  "EAA.png",
  "ISO.png",
  "Mass-Gainer.png",
  "Whey.png",
]);

export async function getProducts(params?: { categoryId?: string | number }): Promise<Product[]> {
  const data = await getProductCatalog(params);
  return data.products;
}

export type ProductCatalogParams = {
  page?: string | number;
  limit?: string | number;
  categoryId?: string | number;
  minPrice?: string | number;
  maxPrice?: string | number;
  sort?: string;
  stock?: string;
  search?: string;
  dietaryType?: string;
  tag?: string;
  minRating?: string | number;
};

export type ProductCatalog = {
  products: Product[];
  total: number;
  page: number;
  pages: number;
  availableTags: string[];
};

export type ProductCategory = {
  id: number;
  name: string;
  image?: string | null;
};

export async function getProductCatalog(params?: ProductCatalogParams): Promise<ProductCatalog> {
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      searchParams.set(key, String(value));
    }
  });
  if (!searchParams.has("limit")) searchParams.set("limit", "9");

  const res = await fetch(`${API_URL}/products?${searchParams.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Products API returned ${res.status}`);
  }
  const data = await res.json();
  const products = Array.isArray(data)
    ? data
    : data.products || data.data?.products || data.data;
  return {
    products: Array.isArray(products) ? products : [],
    total: Number(data.total ?? products?.length ?? 0),
    page: Number(data.page || 1),
    pages: Number(data.pages || 1),
    availableTags: Array.isArray(data.availableTags) ? data.availableTags : [],
  };
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(slug)}`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      return data.product || data;
    }
  } catch (error) {
    console.error(`Unable to fetch product "${slug}" from the API`, error);
  }

  return null;
}

export function productImage(
  product: Pick<Product, "img1" | "img2" | "img3" | "img4" | "img5" | "img6">,
  imageKey: "img1" | "img2" | "img3" | "img4" | "img5" | "img6" = "img1"
) {
  const image = product[imageKey] || product.img1;
  if (!image) return "/assets/img/product/Whey.png";
  if (String(image).startsWith("http")) return String(image);
  if (String(image).startsWith("/")) return String(image);
  if (bundledProductImages.has(String(image))) return `/assets/img/product/${image}`;
  return `${API_URL}/uploads/products/${image}`;
}

export function productVideo(product: Pick<Product, "video">) {
  const video = product.video;
  if (!video) return "";
  if (String(video).startsWith("http")) return String(video);
  if (String(video).startsWith("/")) return String(video);
  return `${API_URL}/uploads/products/${video}`;
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

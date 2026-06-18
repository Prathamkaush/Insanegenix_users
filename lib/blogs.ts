export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  authorName?: string | null;
  tags?: string[];
  status?: "DRAFT" | "PUBLISHED";
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogCatalog = {
  blogs: BlogPost[];
  total: number;
  page: number;
  pages: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

export function blogImage(image?: string | null) {
  if (!image) return "/assets/img/blog/blog-thumb-01.jpg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `${API_URL}/uploads/blogs/${image}`;
}

export async function getBlogs(params?: { page?: string | number; search?: string }): Promise<BlogCatalog> {
  const searchParams = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== "") {
      searchParams.set(key, String(value));
    }
  });
  if (!searchParams.has("limit")) searchParams.set("limit", "9");

  const res = await fetch(`${API_URL}/blogs?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Blogs API returned ${res.status}`);

  const data = await res.json();
  return {
    blogs: Array.isArray(data.blogs) ? data.blogs : [],
    total: Number(data.total || 0),
    page: Number(data.page || 1),
    pages: Number(data.pages || 1),
  };
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function readingTime(content?: string | null) {
  const words = String(content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

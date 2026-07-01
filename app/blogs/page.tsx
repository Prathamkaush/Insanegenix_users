import Link from "next/link";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { blogImage, getBlogs, readingTime } from "@/lib/blogs";

export const metadata = {
  title: "InsaneGenix Blog - Supplement Guides & Fitness Nutrition",
  description:
    "Read InsaneGenix supplement guides, fitness nutrition tips, protein advice, recovery education, and performance-focused articles.",
};

type BlogSearchParams = {
  page?: string;
  search?: string;
};

function blogHref(current: BlogSearchParams, updates: Record<string, string | number | undefined>) {
  const params = new URLSearchParams();
  Object.entries({ ...current, ...updates }).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && key !== "limit") params.set(key, String(value));
  });
  const query = params.toString();
  return query ? `/blogs?${query}` : "/blogs";
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<BlogSearchParams>;
}) {
  const filters = (await searchParams) || {};
  const page = Number(filters.page || 1);
  const catalog = await getBlogs({ ...filters, page });

  return (
    <main className="fix">
      <Breadcrumb title="Blogs" />
      <section className="ig-blogs-page">
        <div className="container">
          <div className="ig-blogs-head">
            <div>
              <span>Learn smarter</span>
              <h1>Supplement guides and fitness nutrition</h1>
              <p>Practical articles for training, recovery, protein, performance, and better everyday choices.</p>
            </div>
            <form className="ig-blog-search" action="/blogs">
              <Search size={17} />
              <input name="search" defaultValue={String(filters.search || "")} placeholder="Search articles..." />
              <button type="submit">Search</button>
            </form>
          </div>

          {catalog.blogs.length ? (
            <div className="ig-blog-grid">
              {catalog.blogs.map((blog) => {
                const coverImage = blogImage(blog.coverImage);

                return (
                  <Link key={blog.id} href={`/blogs/${blog.slug}`} className="ig-blog-card">
                    {coverImage ? <img src={coverImage} alt={blog.title} /> : null}
                    <div>
                      <span className="ig-blog-meta">
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "InsaneGenix"}{" "}
                        / {readingTime(blog.content)} min read
                      </span>
                      <h2>{blog.title}</h2>
                      <p>{blog.excerpt || "Read the full InsaneGenix guide."}</p>
                      <strong>Read article</strong>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="ig-blog-empty">
              <h2>No articles found</h2>
              <p>Try a different search term or check back soon for fresh guides.</p>
              <Link href="/blogs">View all blogs</Link>
            </div>
          )}

          {catalog.pages > 1 ? (
            <nav className="ig-blog-pagination" aria-label="Blog pages">
              <Link
                className={page <= 1 ? "disabled" : ""}
                href={blogHref(filters, { page: Math.max(1, page - 1) })}
                aria-label="Previous page"
              >
                <ArrowLeft size={16} />
              </Link>
              {Array.from({ length: catalog.pages }, (_, index) => index + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  className={pageNumber === page ? "active" : ""}
                  href={blogHref(filters, { page: pageNumber })}
                >
                  {pageNumber}
                </Link>
              ))}
              <Link
                className={page >= catalog.pages ? "disabled" : ""}
                href={blogHref(filters, { page: Math.min(catalog.pages, page + 1) })}
                aria-label="Next page"
              >
                <ArrowRight size={16} />
              </Link>
            </nav>
          ) : null}
        </div>
      </section>
    </main>
  );
}

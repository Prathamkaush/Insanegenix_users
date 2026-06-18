import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { blogImage, getBlog, readingTime } from "@/lib/blogs";

type BlogDetailParams = {
  slug: string;
};

export async function generateMetadata({ params }: { params: Promise<BlogDetailParams> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) {
    return {
      title: "Blog Not Found - InsaneGenix",
    };
  }

  return {
    title: blog.metaTitle || `${blog.title} - InsaneGenix Blog`,
    description: blog.metaDescription || blog.excerpt || undefined,
    keywords: blog.metaKeywords || undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || undefined,
      images: blog.coverImage ? [blogImage(blog.coverImage)] : undefined,
      type: "article",
      publishedTime: blog.publishedAt || undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<BlogDetailParams> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const paragraphs = String(blog.content || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="fix">
      <Breadcrumb title={blog.title} />
      <article className="ig-blog-detail">
        <div className="container">
          <Link href="/blogs" className="ig-blog-back">
            <ArrowLeft size={16} /> Back to blogs
          </Link>

          <header className="ig-blog-detail-head">
            <div className="ig-blog-detail-meta">
              <span><User size={14} /> {blog.authorName || "InsaneGenix Team"}</span>
              <span><Clock size={14} /> {readingTime(blog.content)} min read</span>
              {blog.publishedAt ? (
                <span>
                  {new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              ) : null}
            </div>
            <h1>{blog.title}</h1>
            {blog.excerpt ? <p>{blog.excerpt}</p> : null}
            {Array.isArray(blog.tags) && blog.tags.length ? (
              <div className="ig-blog-tags">
                {blog.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}
          </header>

          <img className="ig-blog-cover" src={blogImage(blog.coverImage)} alt={blog.title} />

          <div className="ig-blog-content">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}

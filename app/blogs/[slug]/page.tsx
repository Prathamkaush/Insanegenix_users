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

function parseBlogContent(content: string): React.ReactNode[] {
  if (!content) return [];

  const lines = content.split(/\r?\n/).map((line) => line.trim());
  const elements: React.ReactNode[] = [];

  let currentListItems: string[] = [];
  let paragraphText: string[] = [];

  const flushList = (key: string | number) => {
    if (currentListItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="ig-blog-list">
          {currentListItems.map((item, idx) => (
            <li key={idx}>{renderTextWithFormatting(item)}</li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  const flushParagraph = (key: string | number) => {
    if (paragraphText.length > 0) {
      const text = paragraphText.join(" ");
      elements.push(
        <p key={`p-${key}`}>{renderTextWithFormatting(text)}</p>
      );
      paragraphText = [];
    }
  };

  function isHeading(line: string) {
    if (!line) return false;
    if (line.startsWith("#")) return true;

    const isShort = line.length < 75;
    const endsWithPunctuation = /[.,:;!]/.test(line[line.length - 1]);
    const startsWithCapital = /^[A-Z0-9]/.test(line);
    const firstWord = line.split(" ")[0].toLowerCase();
    const isCommonWord = ["and", "or", "but", "the", "a", "an", "for", "with", "from"].includes(firstWord);

    return isShort && !endsWithPunctuation && startsWithCapital && !isCommonWord;
  }

  function renderTextWithFormatting(text: string): React.ReactNode {
    const parts = text.split(/(\*\*.*?\*\*|__.*?__)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("__") && part.endsWith("__")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) {
      flushParagraph(i);
      flushList(i);
      continue;
    }

    const bulletMatch = line.match(/^([●•*\-▪o]|\d+\.)\s*(.*)/);
    if (bulletMatch) {
      flushParagraph(i);
      currentListItems.push(bulletMatch[2].trim());
      continue;
    }

    if (isHeading(line)) {
      flushParagraph(i);
      flushList(i);

      const isMdHeading = line.startsWith("#");
      if (isMdHeading) {
        const mdLevel = (line.match(/^#+/) || ["##"])[0].length;
        const cleanText = line.replace(/^#+\s+/, "");
        if (mdLevel === 1) {
          elements.push(<h1 key={`h-${i}`}>{renderTextWithFormatting(cleanText)}</h1>);
        } else if (mdLevel === 2) {
          elements.push(<h2 key={`h-${i}`}>{renderTextWithFormatting(cleanText)}</h2>);
        } else if (mdLevel === 3) {
          elements.push(<h3 key={`h-${i}`}>{renderTextWithFormatting(cleanText)}</h3>);
        } else {
          elements.push(<h4 key={`h-${i}`}>{renderTextWithFormatting(cleanText)}</h4>);
        }
      } else {
        const h2Keywords = [
          "introduction",
          "why",
          "how to",
          "what is",
          "common",
          "sample",
          "final thoughts",
          "seo elements",
          "can creatine",
          "who should",
        ];
        const isH2 = h2Keywords.some((kw) => line.toLowerCase().includes(kw)) || line.length > 30;

        if (isH2) {
          elements.push(<h2 key={`h2-${i}`}>{renderTextWithFormatting(line)}</h2>);
        } else {
          elements.push(<h3 key={`h3-${i}`}>{renderTextWithFormatting(line)}</h3>);
        }
      }
      continue;
    }

    flushList(i);
    paragraphText.push(line);
  }

  flushParagraph(lines.length);
  flushList(lines.length);

  return elements;
}

export default async function BlogDetailPage({ params }: { params: Promise<BlogDetailParams> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const parsedContent = parseBlogContent(blog.content || "");

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
            {parsedContent}
          </div>
        </div>
      </article>
    </main>
  );
}

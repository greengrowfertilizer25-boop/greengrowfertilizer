import type { Metadata } from 'next';
import { collectionFor } from '@/lib/server/resources';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const col = await collectionFor("blogs");
    const { slug } = await params;
    // Attempt to find by slug or fallback to id
    const blog = await col.findOne({ $or: [{ slug }, { id: slug }] });
    
    if (blog) {
      return {
        title: blog.metaTitle || blog.title,
        description: blog.metaDescription || blog.desc,
        openGraph: {
          title: blog.metaTitle || blog.title,
          description: blog.metaDescription || blog.desc,
          type: "article",
          publishedTime: blog.date,
          authors: ["Greengrow Fertilizer"],
          images: blog.image ? [{ url: blog.image }] : undefined,
        },
        twitter: {
          card: "summary_large_image",
          title: blog.metaTitle || blog.title,
          description: blog.metaDescription || blog.desc,
          images: blog.image ? [blog.image] : undefined,
        }
      };
    }
  } catch (err) {
    console.error("Error generating metadata for blog", err);
  }
  return { 
    title: "Blog Post | Greengrow Fertilizer",
    description: "Read our latest blog post about agriculture and farming."
  };
}

export default async function BlogLayout({ children, params }: { children: React.ReactNode, params: Promise<{ slug: string }> }) {
  let jsonLd = null;
  try {
    const { slug } = await params;
    const col = await collectionFor("blogs");
    const blog = await col.findOne({ $or: [{ slug }, { id: slug }] });
    if (blog) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "description": blog.metaDescription || blog.desc,
        "image": blog.image ? [blog.image] : undefined,
        "datePublished": blog._createdAt || blog.date,
        "dateModified": blog._updatedAt || blog._createdAt || blog.date,
        "author": [{
            "@type": "Organization",
            "name": "Greengrow Fertilizer",
            "url": process.env.NEXT_PUBLIC_BASE_URL || "https://greengrowfertilizer.com"
        }]
      };
    }
  } catch (e) {
    // Ignore error
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}

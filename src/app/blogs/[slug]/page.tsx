"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import type { BlogItem } from "@/data/adminContent";
import { useResource } from "@/lib/client/useResource";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { items: blogs, loading } = useResource<BlogItem>("blogs");
  const blog = blogs.find((item) => item.slug === slug || item.id === slug);

  if (!blog) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-black text-slate-900">
          {loading ? "Loading article..." : "Article not found"}
        </h1>
        {!loading && (
          <Link href="/" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
            Return to Home
          </Link>
        )}
      </div>
    );
  }

  // Related articles
  const relatedBlogs = blogs
    .filter((item) => item.category === blog.category && item.id !== blog.id)
    .slice(0, 3);
  
  const fallbackBlogs = relatedBlogs.length > 0 
    ? relatedBlogs 
    : blogs.filter((item) => item.id !== blog.id).slice(0, 3);

  return (
    <div className="bg-stone-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div className="text-left">
          <Link
            href="/#agri-advisor"
            className="inline-flex items-center gap-2 text-xs font-black text-stone-500 hover:text-emerald-700 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-sm">
          <div className="aspect-[21/9] sm:aspect-[3/1] relative bg-stone-100 w-full overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
            
            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 text-white">
               <div className="flex flex-wrap items-center gap-4 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-3">
                 <span className="bg-emerald-600 px-3 py-1 rounded-full">{blog.category}</span>
                 <span className="flex items-center gap-1.5 text-stone-200">
                   <Calendar className="w-3.5 h-3.5" />
                   {blog.date}
                 </span>
               </div>
               <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight sm:leading-tight">
                 {blog.title}
               </h1>
            </div>
          </div>
          
          <div className="p-6 sm:p-10 prose prose-stone max-w-none prose-headings:font-black prose-a:text-emerald-700 hover:prose-a:text-emerald-800">
            <div 
              className="text-lg sm:text-xl text-stone-600 font-medium leading-relaxed mb-8 [&>p]:mb-4 break-words whitespace-pre-wrap overflow-hidden"
              dangerouslySetInnerHTML={{ __html: blog.desc }} 
            />
          </div>
        </div>

        {/* Related Articles */}
        {fallbackBlogs.length > 0 && (
          <div className="pt-8 space-y-6">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {fallbackBlogs.map((item) => (
                  <Link
                  key={item.id}
                  href={`/blogs/${item.slug || item.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200/50 hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-[16/10] bg-stone-100 relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider mb-2">
                        <span className="text-emerald-700">{item.category}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { Product } from "@/data/products";
import type {
  BlogItem,
  CategoryItem,
  CropItem,
  D2CSection,
  HeroSlide,
} from "@/data/adminContent";
import ProductModal from "@/components/ProductModal";
import { useResource } from "@/lib/client/useResource";
import { useSettings } from "@/lib/client/useSettings";

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { items: products } = useResource<Product>("products");
  const { items: slides } = useResource<HeroSlide>("hero");
  const { items: categories } = useResource<CategoryItem>("categories");
  const { items: crops } = useResource<CropItem>("crops");
  const { items: blogs } = useResource<BlogItem>("blogs");
  const { data: d2c } = useSettings<D2CSection | null>("d2c", null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slides.length < 2) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || products.length === 0) return;

    const interval = setInterval(() => {
      const cards = el.querySelectorAll("a");
      if (cards.length === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 15) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        // Scroll by the entire visible width of the container at once
        el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [products]);

  // Take all products for showcase as requested by client
  const featuredProducts = products;
  const bestSellers = products.length >= 8 ? products.slice(4, 8) : products.slice(0, 4);

  return (
    <div className="space-y-8 pb-24 bg-stone-50/50">
      {/* Viewport Height Wrapper for First Fold */}
      <div className="h-[calc(100svh-57px-60px)] md:h-[calc(100vh-73px)] flex flex-col justify-between p-3 pb-2 gap-2">
        {/* Hero Section */}
        <section className="w-full relative flex-1 min-h-0 flex items-stretch">
          <div className="relative rounded-2xl overflow-hidden shadow-sm bg-stone-900 w-full flex items-center h-full">
            {/* Sliding Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
              style={{ backgroundImage: slides[currentSlide]?.image ? `url('${slides[currentSlide].image}')` : "none" }}
            />
            <div className="absolute inset-0 bg-black/20" />

            {/* Centered Main Headline at the Top */}
            <div className="absolute top-6 sm:top-10 md:top-12 inset-x-0 mx-auto text-center px-6 max-w-3xl z-10">
              <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                {slides[currentSlide]?.headline}
              </h1>
            </div>

            {/* Carousel Navigation Dot Indicators */}
            <div className="absolute bottom-16 sm:bottom-20 md:bottom-20 inset-x-0 mx-auto flex justify-center gap-1.5 z-20">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "bg-white w-5" : "bg-white/40 hover:bg-white/60"
                    }`}
                />
              ))}
            </div>

            {/* Bottom Row Layout: Subtext on bottom-left, Button on bottom-right */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 z-10 flex items-center justify-between gap-4 border-t border-white/10 pt-3.5">
              <p className="text-stone-300 text-xs sm:text-sm font-bold leading-none">
                {slides[currentSlide]?.subtext}
              </p>
              <Link
                href="/products"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0"
              >
                Claim Now
              </Link>
            </div>
          </div>
        </section>

        {/* Recommended products are intentionally second so they remain in the first fold. */}
        <section className="w-full space-y-2 shrink-0">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-sm sm:text-xl font-black text-slate-900 font-sans">Recommended Products</h2>
            </div>
            <Link href="/products" className="text-emerald-655 hover:text-emerald-700 text-xs font-extrabold shrink-0">
              View All
            </Link>
          </div>

          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1.5 scrollbar-none snap-x snap-mandatory">
            {featuredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.id}`}
                className="bg-white border border-stone-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between h-36 sm:h-40 md:h-48 lg:h-56 xl:h-60 relative text-left w-[44vw] min-w-40 max-w-52 md:w-[22vw] md:max-w-[260px] lg:w-[23.5%] lg:min-w-[260px] shrink-0 snap-start"
              >
                {/* Premium Discount Tag */}
                {prod.discount > 0 && (
                  <div className="absolute top-2 left-2 lg:top-3 lg:left-3 z-10 bg-emerald-900 text-white text-[7px] lg:text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {prod.discount}% Off
                  </div>
                )}

                <div className="p-2 md:p-2.5 lg:p-3 flex-grow min-h-0 flex flex-col">
                  {/* Visual Packaging Image Container */}
                  <div className="flex-1 rounded-xl bg-stone-50 flex items-center justify-center mb-1.5 lg:mb-2 relative overflow-hidden min-h-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply p-1 lg:p-2"
                    />
                  </div>

                  <div className="min-h-0 space-y-0.5 lg:space-y-1">
                    <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest text-stone-400 block">{prod.category}</span>
                    <h3 className="text-[10px] sm:text-xs lg:text-sm font-black text-slate-905 leading-snug line-clamp-1 lg:line-clamp-2 transition-colors group-hover:text-emerald-700">
                      {prod.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

       {/* 5. Shop By Crop - Premium Interactive Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div>
          <h2 className="text-base sm:text-2xl font-black text-slate-900">Customized Schedules By Crops</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {crops.map((crop) => (
            <Link
              key={crop.id || crop.name}
              href={`/crops/${crop.id}`}
              className="relative rounded-2xl overflow-hidden shadow-sm h-36 w-full flex items-end group cursor-pointer border border-stone-200/50 bg-stone-900"
            >
              {crop.image && (
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent group-hover:via-stone-900/50 transition-all" />

              <div className="relative z-10 p-3.5 space-y-0.5 w-full">
                <h3 className="text-xs sm:text-sm font-black text-white leading-tight flex items-center gap-1.5">
                  <span className="truncate">{crop.name}</span>
                </h3>
                <p className="text-[9px] text-stone-300 font-semibold truncate leading-none">
                  {crop.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

       {/* 6.2 Best Seller Products Feed */}
      <section className="max-w-7xl mx-auto px-4 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-base sm:text-2xl font-black text-slate-900">Best Seller Solubles</h2>
          </div>
          <Link href="/products" className="text-emerald-655 hover:text-emerald-700 text-xs font-extrabold shrink-0">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {bestSellers.map((prod) => (
            <Link
              key={prod.id}
              href={`/products/${prod.id}`}
              className="bg-white border border-stone-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full relative text-left"
            >
              {/* Premium Discount Tag */}
              {prod.discount > 0 && (
                <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-900 text-white text-[8px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {prod.discount}% Off
                </div>
              )}

              <div className="p-3 flex-grow">
                {/* Visual Packaging Image Container */}
                <div className="aspect-square rounded-xl bg-stone-50 flex items-center justify-center mb-3.5 relative overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply p-2"
                  />
                </div>

                <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 block">{prod.category}</span>
                <h3 className="text-xs font-black text-slate-905 mt-1 leading-snug line-clamp-2 transition-colors group-hover:text-emerald-700">
                  {prod.name}
                </h3>

                {/* Star Rating - Clean Typographic Layout */}
                <div className="flex items-center gap-1 mt-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-current shrink-0" />
                  <span className="text-[10px] text-slate-700 font-black">4.9</span>
                  <span className="text-[9px] text-slate-400 font-bold">({prod.reviews})</span>
                </div>
              </div>

              {/* Pricing & CTA panel */}
              <div className="p-3 pt-0 mt-auto w-full">
                <span className="block w-full text-center bg-emerald-50 text-emerald-850 border border-emerald-100/50 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 py-1.5 rounded-xl text-[10px] font-black transition-all duration-300">
                  Enquire
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Shop By Category */}
      <section className="w-full px-4 space-y-4 max-w-7xl mx-auto">
        <div>
          <h2 className="text-base sm:text-2xl font-black text-slate-900 font-sans">Shop By Category</h2>
        </div>

        {/* Mobile: Horizontal Scroll Slider | Desktop: Grid */}
        <div className="flex gap-3.5 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-5 md:gap-4 md:overflow-visible">
          {categories.map((cat) => {
            const imgSrc = cat.image;
            return (
              <Link
                key={cat.name}
                href={`/products?category=${cat.name}`}
                className="relative rounded-xl overflow-hidden shadow-sm h-24 sm:h-44 w-[110px] md:w-full shrink-0 snap-start flex items-end group cursor-pointer border border-stone-200/50"
              >
                <img
                  src={imgSrc}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent group-hover:via-stone-900/50 transition-colors" />
                <div className="relative z-10 p-2.5 space-y-0.5 w-full">
                  <span className="text-[7px] font-black text-emerald-400 uppercase tracking-widest block">
                    {cat.count} Products
                  </span>
                  <h3 className="text-[10px] sm:text-sm font-black text-white leading-tight">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

     

      {/* 6. D2C Feature Section - Mobile-First Unified Image Overlay Card */}
      {d2c && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-sm h-56 sm:h-64 md:h-[260px] bg-stone-900 w-full flex items-end p-4.5 sm:p-8">
            {/* Background Image */}
            {d2c.image && (
              <img
                src={d2c.image}
                alt="Greengrow Fertilizer factory dispatch unit"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            {/* Dark Gradient Mask for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />

            {/* Overlay Typography Container */}
            <div className="relative z-10 max-w-2xl space-y-2.5 text-white text-left">
              <div className="space-y-0.5">
                <span className="text-[8px] sm:text-[9px] font-black text-emerald-450 uppercase tracking-widest block">
                  {d2c.badge}
                </span>
                <h2 className="text-sm sm:text-xl md:text-2xl font-black leading-tight">
                  {d2c.heading}
                </h2>
              </div>

              <p className="text-stone-300 text-[9px] sm:text-xs leading-normal max-w-xl font-medium">
                {d2c.description}
              </p>

              {/* Compact Horizontal Row for Mobile */}
              <div className="flex flex-wrap gap-x-3.5 gap-y-1.5 text-[8px] sm:text-[10px] font-black text-emerald-400">
                {(d2c.bullets || []).map((bullet) => (
                  <span key={bullet} className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                    {bullet}
                  </span>
                ))}
              </div>

              {d2c.ctaText && (
                <div className="pt-0.5">
                  <Link
                    href="/about"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-black text-[9px] sm:text-xs uppercase tracking-wider inline-block shadow-md transition-all duration-300"
                  >
                    {d2c.ctaText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
     

      {/* 7. Agricultural Blogs - Premium Editorial Grid */}
      <section id="agri-advisor" className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="text-left space-y-1">
          <h2 className="text-base sm:text-2xl font-black text-slate-900">Agri Advisor & News</h2>
          <p className="text-stone-500 text-xs sm:text-sm">Professional advice on crop safety, organic nutrients, and seasonal farming tips.</p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-3.5 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
          {(() => {
            return blogs.map((blog) => (
              <Link href={`/blogs/${blog.slug || blog.id}`} key={blog.id} className="group cursor-pointer flex flex-col justify-between space-y-3.5 shrink-0 w-[240px] sm:w-[300px] md:w-full snap-start">
                <div>
                  {/* Blog Aspect Ratio Image Container */}
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden relative bg-stone-100 shadow-sm">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>

                  {/* Metadata: Category & Date */}
                  <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-wider mt-1">
                    <span className="text-emerald-700">{blog.category}</span>
                    <span className="text-stone-400">{blog.date}</span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mt-2 leading-snug line-clamp-2 transition-colors group-hover:text-emerald-750">
                    {blog.title}
                  </h3>
                  <div className="text-xs text-stone-500 leading-relaxed line-clamp-3 mt-1.5 font-medium [&>p]:inline" dangerouslySetInnerHTML={{ __html: blog.desc }} />
                </div>

                <div className="pt-1">
                  <span className="text-slate-900 group-hover:text-emerald-700 text-xs font-black inline-flex items-center gap-1 transition-colors">
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ));
          })()}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

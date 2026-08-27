"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Star, ShoppingBag, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import type { Product } from "@/data/products";
import { useResource } from "@/lib/client/useResource";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { items: products, loading } = useResource<Product>("products");
  const product = products.find((item) => item.id === id);

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-black text-slate-900">
          {loading ? "Loading product..." : "Product not found"}
        </h1>
        {!loading && (
          <Link href="/products" className="text-sm font-bold text-emerald-700 hover:text-emerald-800">
            Return to Products Catalog
          </Link>
        )}
      </div>
    );
  }

  const relatedProducts = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  ).slice(0, 4);

  const fallbackProducts = relatedProducts.length > 0
    ? relatedProducts
    : products.filter((item) => item.id !== product.id).slice(0, 4);

  // Generate WhatsApp message link
  const waMsg = encodeURIComponent(
    `Hello Greengrow Fertilizer! I am interested in purchasing your product: "${product.name}".\n` +
    `Category: ${product.category}\n` +
    `Price: ₹${product.currentPrice} (Discounted from ₹${product.originalPrice})\n` +
    `Please guide me on how to place the order and check shipping availability.`
  );
  const whatsappUrl = `https://wa.me/918269108808?text=${waMsg}`;

  const allBenefits = product.benefits.flatMap(b => b.split(/(?<=\.)\s+/)).filter(Boolean).map(s => s.trim());
  const usageLines = product.recommendedUsage.split(/(?<=\.)\s+/).filter(Boolean).map(s => s.trim());

  return (
    <div className="bg-stone-50/50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Back Link */}
        <div className="text-left">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-black text-stone-500 hover:text-emerald-700 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products Catalog
          </Link>
        </div>

        {/* Product Details Section */}
        <div className="bg-white border border-stone-200/60 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0">

          {/* Left Column: Product Visuals */}
          <div className="lg:col-span-6 bg-gradient-to-br from-emerald-50/50 to-teal-50/20 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200/50">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="bg-emerald-100/80 text-emerald-800 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {product.category}
                </span>
                {product.discount > 0 && (
                  <span className="bg-amber-100 text-amber-850 text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                    {product.discount}% OFF
                  </span>
                )}
              </div>

              {/* Product Visual Packaging Container */}
              <div className="my-8 flex justify-center">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-white flex items-center justify-center text-white shadow-lg shadow-emerald-700/5 border border-stone-100 relative overflow-hidden group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Double-Seal Guarantee Info */}
            <div className="bg-white/80 border border-emerald-500/10 rounded-2xl p-4 flex gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Double-Seal Guarantee</h4>
                <p className="text-[10px] text-stone-500 font-medium leading-normal mt-0.5">
                  This crop solution is direct-dispatched from the Greengrow facility with strict chemical batch sealing, ensuring maximum active ingredient life.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Info & CTA */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-8">
            <div className="space-y-6 text-left">

              {/* Product Info Headers */}
              <div>
                {product.subcategory && (
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-1">
                    {product.subcategory}
                  </span>
                )}
                <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-700">{product.rating}</span>
                  <span className="text-[10px] font-bold text-stone-400">({product.reviews} verified orders)</span>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-stone-50 border border-stone-200/50 rounded-2xl p-4.5 flex items-center justify-between">
                <div>
                  <span className="block text-[8px] font-black text-stone-400 uppercase tracking-wider">Pricing</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-black text-slate-900">Price on Request</span>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-800 text-[10px] font-black px-3 py-1.5 rounded-xl border border-emerald-500/10">
                  Bulk Discounts Available
                </div>
              </div>

              {/* Composition Section */}
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Composition</h4>
                <p className="text-xs font-bold text-slate-700 bg-stone-50 border border-stone-100 p-3 rounded-xl leading-relaxed">
                  {product.composition}
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Key Crop Benefits</h4>
                <ul className="space-y-2.5">
                  {allBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-stone-600 bg-white p-3 rounded-xl border border-stone-100 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Usage Section */}
              <div className="border-t border-stone-150 pt-5">
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Recommended Usage & Dosage</h4>
                <div className="bg-emerald-50/30 border border-emerald-600/10 p-4 rounded-xl">
                  <ul className="space-y-2.5">
                    {usageLines.map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs font-medium text-stone-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Packaging Sizes */}
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Available Packaging Sizes</h4>
                <div className="flex flex-wrap gap-2">
                  {product.packagingDetails.map((size) => (
                    <span
                      key={size}
                      className="text-xs font-bold text-slate-700 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-sm hover:border-emerald-600/40 cursor-default transition-all"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Checkout CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-stone-150 pt-6">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs shadow-md"
              >
                <MessageCircle className="w-4.5 h-4.5 fill-current" />
                Order via WhatsApp
              </a>
              <Link
                href={`/contact?subject=Dealership%20Enquiry%20for%20${encodeURIComponent(product.name)}`}
                className="bg-slate-900 hover:bg-slate-955 text-white font-black uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                Request Dealer Price
              </Link>
            </div>

          </div>

        </div>

        {/* Bottom Related Products Section */}
        <section className="space-y-6">
          <div className="text-left">
            <h2 className="text-base sm:text-2xl font-black text-slate-900 font-sans">
              Related Crop Solutions
            </h2>
            <p className="text-xs text-stone-400 font-semibold mt-0.5">
              Other high-performing formulations in the {product.category} category.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {fallbackProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.id}`}
                className="bg-white border border-stone-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-305 group cursor-pointer flex flex-col justify-between h-full relative p-3"
              >
                {/* Premium Discount Tag */}
                {prod.discount > 0 && (
                  <div className="absolute top-2.5 left-2.5 z-10 bg-emerald-900 text-white text-[8px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    {prod.discount}% Off
                  </div>
                )}

                <div>
                  {/* Visual Packaging Image Container */}
                  <div className="aspect-square rounded-xl bg-stone-50 flex items-center justify-center mb-3.5 relative overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 block text-left">
                    {prod.category}
                  </span>
                  <h3 className="text-xs font-black text-slate-905 mt-1 leading-snug line-clamp-2 transition-colors group-hover:text-emerald-700 text-left">
                    {prod.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2 text-left">
                    <div className="flex text-amber-500">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span className="text-[10px] font-black text-slate-700">{prod.rating}</span>
                    <span className="text-[8px] text-stone-400 font-semibold">({prod.reviews})</span>
                  </div>
                </div>

                {/* Bottom Pricing Row */}
                <div className="flex items-center justify-between border-t border-stone-100 pt-3 mt-3">
                  <span className="text-[10px] font-black text-emerald-700">Enquire Now</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

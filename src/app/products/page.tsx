"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Star, RotateCcw } from "lucide-react";
import type { Product } from "@/data/products";
import ProductModal from "@/components/ProductModal";
import { useResource } from "@/lib/client/useResource";
import type { CategoryItem } from "@/data/adminContent";

function ProductsContent() {
  const searchParams = useSearchParams();

  return (
    <ProductsCatalog
      key={searchParams.toString()}
      initialCategory={searchParams.get("category") || "All"}
      initialSearch={searchParams.get("search") || ""}
    />
  );
}

function ProductsCatalog({
  initialCategory,
  initialSearch,
}: {
  initialCategory: string;
  initialSearch: string;
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { items: products, error } = useResource<Product>("products");
  const { items: dbCategories } = useResource<CategoryItem>("categories");

  const sortedCategories = [...dbCategories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  const categoryNames = ["All", ...sortedCategories.map(c => c.name)];
  
  const currentCategoryObj = sortedCategories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
  const isComingSoon = currentCategoryObj?.isComingSoon || false;

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const isAll = selectedCategory.toLowerCase() === "all";
    const prodCat = product.category.toLowerCase();
    const selCat = selectedCategory.toLowerCase();
    const matchesCategory = isAll || prodCat === selCat || prodCat.startsWith(selCat) || selCat.startsWith(prodCat);
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 space-y-6 sm:space-y-8">

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-0.5 text-left">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
            Factory dispatch
          </span>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Fertilizers & Biocides
          </h1>
          <p className="text-stone-500 text-xs font-medium">
            Displaying {filteredProducts.length} certified solutions direct from manufacturing unit.
          </p>
        </div>

        {/* Reset Filter Button */}
        {(selectedCategory !== "All" || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors self-start md:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* 2. Interactive Search & Horizontal Categories Swiper */}
      <div className="space-y-4">
        {/* Search Field */}
        <div className="relative flex items-center max-w-md w-full">
          <input
            type="text"
            placeholder="Search NPK, Mycorrhiza, Humic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-slate-800 text-xs p-3.5 pl-10 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 transition-all font-semibold"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
        </div>

        {/* Horizontal Category Pill List (Mobile First) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
          {categoryNames.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 snap-start text-xs font-black px-4.5 py-2.5 rounded-xl transition-all border ${isActive
                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          {error}
        </p>
      )}

      {/* 3. Product Catalog Grid (2 columns on mobile, 4 columns on desktop) */}
      <main className="w-full">
        {isComingSoon ? (
          <div className="bg-white border border-stone-200/50 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
            <span className="text-4xl block mb-3">🚀</span>
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">Soon to be launched</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mb-5 leading-normal font-medium">
              We are working hard to bring you the best {selectedCategory.toLowerCase()}. Stay tuned for updates!
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white border border-stone-200/50 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 mb-1">No Solutions Found</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5 leading-normal">
              We could not find any products matching your search query. Try resetting or selecting another category.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl shadow-md transition-all"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {filteredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={`/products/${prod.id}`}
                className="bg-white border border-stone-200/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer flex flex-col justify-between h-full relative"
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
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply p-1 lg:p-2"
                    />
                  </div>

                  <span className="text-[8px] font-black uppercase tracking-widest text-stone-400 block">{prod.category}</span>
                  <h3 className="text-xs font-black text-slate-905 mt-1 leading-snug line-clamp-2 transition-colors group-hover:text-emerald-700">
                    {prod.name}
                  </h3>

                  {/* Star Rating - Clean Typographic Layout */}
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" />
                    <span className="text-[10px] text-slate-700 font-black">{prod.rating || "4.8"}</span>
                    <span className="text-[9px] text-slate-405 font-bold">({prod.reviews})</span>
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
        )}
      </main>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

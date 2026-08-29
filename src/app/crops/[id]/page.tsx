"use client";

import { useParams } from "next/navigation";
import type { CropItem } from "@/data/adminContent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useResource } from "@/lib/client/useResource";
import type { Product } from "@/data/products";

export default function CropDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { items: crops, loading: cropsLoading } = useResource<CropItem>("crops");
  const { items: products } = useResource<Product>("products");

  const crop = crops.find((c) => c.id === id);

  if (cropsLoading) {
    return (
      <main className="bg-stone-50 flex items-center justify-center py-12">
        <p className="text-stone-500 font-medium">Loading crop details...</p>
      </main>
    );
  }

  if (!crop) {
    return (
      <main className="bg-stone-50 flex flex-col py-12">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">Crop Not Found</h1>
          <p className="text-stone-500 mb-6">The crop you are looking for does not exist.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-emerald-650 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors">
            Return Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-stone-50 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-500 hover:text-emerald-700 transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="h-64 w-full relative">
            <img src={crop.image} alt={crop.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent" />
            <h1 className="absolute bottom-6 left-6 text-3xl sm:text-4xl font-black text-white font-display">
              {crop.name}
            </h1>
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            <section>
              <h2 className="text-lg font-black text-slate-900 mb-3 border-b border-stone-100 pb-2">
                Common Pests & Diseases
              </h2>
              <p className="text-stone-600 font-medium leading-relaxed">
                {crop.desc}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-slate-900 mb-3 border-b border-stone-100 pb-2">
                Fertigation & Care Schedule
              </h2>
              {crop.fertilizerSchedules && crop.fertilizerSchedules.length > 0 ? (
                <div className="space-y-4">
                  {crop.fertilizerSchedules.map((sched) => {
                    const matchedProduct = products.find(p => p.id === sched.productId);
                    const prodImage = matchedProduct?.image || null;
                    return (
                    <div key={sched.id} className="bg-stone-50 border border-stone-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {prodImage && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-white">
                            <img src={prodImage} alt={sched.productName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-emerald-700 tracking-wide uppercase mb-1">
                            Day {sched.startDay} - {sched.endDay}
                          </p>
                          {sched.productId ? (
                            <Link href={`/products/${sched.productId}`} className="text-lg font-black text-slate-900 hover:text-emerald-700 transition-colors">
                              {sched.productName || "Unknown Product"}
                            </Link>
                          ) : (
                            <p className="text-lg font-black text-slate-900">{sched.productName || "Unknown Product"}</p>
                          )}
                        </div>
                      </div>
                      <div className="bg-white border border-stone-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 whitespace-nowrap shadow-sm text-center">
                        <span className="block text-[10px] text-stone-400 uppercase tracking-wide">Dosage</span>
                        {sched.quantity} {sched.unit}
                      </div>
                    </div>
                  )})}
                </div>
              ) : (
                <p className="text-stone-400 italic text-sm">No specific schedule provided for this crop yet.</p>
              )}
              {crop.schedule && (
                <div className="mt-8 pt-8 border-t border-stone-100">
                  <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">Additional Information</h3>
                  <div 
                    className="prose prose-stone prose-sm max-w-none text-stone-600 font-medium"
                    dangerouslySetInnerHTML={{ __html: crop.schedule }}
                  />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

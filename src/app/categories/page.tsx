"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { CategoryItem } from "@/data/adminContent";
import { useResource } from "@/lib/client/useResource";

import { useState } from "react";
import type { ProductItem } from "@/data/products";
import type { CropItem } from "@/data/adminContent";

export default function CategoriesPage() {
  const { items: categories, error } = useResource<CategoryItem>("categories");
  const [isGenerating, setIsGenerating] = useState(false);

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 space-y-8">

      {/* Page Header */}
      <div className="text-left space-y-0.5">
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">
          Departments
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Shop By Category
        </h1>
        <p className="text-stone-400 text-[10px] sm:text-xs font-semibold">
          Select a category to browse targeted crop protection and bio-inputs.
        </p>
      </div>

      {error && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-800">
          {error}
        </p>
      )}

      {/* High Density E-commerce Category Grid (3 cols on mobile, 5 cols on desktop) */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-6">
        {sortedCategories.map((cat) => {
          const content = (
            <>
              {/* Square Image container */}
              <div className={`aspect-square w-full rounded-2xl overflow-hidden relative bg-stone-50 border border-stone-200/50 shadow-sm ${cat.isComingSoon ? 'opacity-60 grayscale' : ''}`}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`w-full h-full object-cover transition-transform duration-500 ${cat.isComingSoon ? '' : 'group-hover:scale-105'}`}
                />
              </div>

              {/* Typography */}
              <div className="space-y-0.5 relative flex flex-col items-center">
                <h3 className="text-[10px] sm:text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-1">
                  {cat.name}
                </h3>
                {cat.isComingSoon ? (
                  <span className="text-[8px] sm:text-[9px] font-bold text-rose-500 block uppercase tracking-wide bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    Coming Soon
                  </span>
                ) : (
                  <span className="text-[8px] sm:text-[9px] font-bold text-stone-400 block">
                    {cat.count} Items
                  </span>
                )}
              </div>
            </>
          );

          return cat.isComingSoon ? (
            <div key={cat.id} className="group flex flex-col items-center text-center space-y-1.5 opacity-80 cursor-not-allowed">
              {content}
            </div>
          ) : (
            <Link
              key={cat.id}
              href={`/products?category=${cat.name}`}
              className="group cursor-pointer flex flex-col items-center text-center space-y-1.5"
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* Brochure download CTA - Compact & Low-Profile Banner */}
      <div className="bg-stone-50 border border-stone-200/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-0.5 text-left">
          <div className="inline-flex items-center gap-1.5 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>Product Catalogue</span>
          </div>
          <h2 className="text-xs sm:text-sm font-black text-slate-900">
            Download Crop Protection Catalog (PDF)
          </h2>
          <p className="text-stone-400 text-[9px] sm:text-xs font-medium">
            Get offline access to ingredient schedules and recommended dosage charts.
          </p>
        </div>

        <button
          onClick={async (e) => {
            e.preventDefault();
            setIsGenerating(true);
            try {
              const [prodRes, cropRes, settingsRes] = await Promise.all([
                fetch("/api/products"),
                fetch("/api/crops"),
                fetch("/api/settings")
              ]);
              const prodData = await prodRes.json();
              const cropData = await cropRes.json();
              const settingsData = await settingsRes.json();
              
              const products: ProductItem[] = prodData.data || [];
              const crops: CropItem[] = cropData.data || [];
              const logo = settingsData.data?.logo || "";

              const htmlContent = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
                  <div style="border-bottom: 3px solid #059669; padding-bottom: 15px; margin-bottom: 25px; display: flex; align-items: center; gap: 15px;">
                    ${logo ? `<img src="${logo}" alt="Logo" style="width: 50px; height: 50px; object-fit: contain;" crossorigin="anonymous" />` : ''}
                    <div>
                      <h1 style="color: #059669; font-size: 24px; margin: 0; font-weight: 900; text-transform: uppercase;">GREENGROW FERTILIZER PVT. LTD.</h1>
                      <p style="margin: 5px 0 0; font-size: 13px; color: #64748b; font-weight: 600;">Premium Crop Protection & Bio-Inputs Catalogue</p>
                      <p style="margin: 5px 0 0; font-size: 11px; color: #94a3b8;">Generated on: ${new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px;">Our Premium Products</h2>
                  <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px;">
                    ${products.map(p => `
                      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; background-color: #f8fafc; page-break-inside: avoid;">
                        <div style="background-color: #059669; color: white; padding: 12px 15px;">
                          <h3 style="margin: 0; font-size: 16px; font-weight: 800;">${p.name}</h3>
                          <p style="margin: 4px 0 0; font-size: 11px; opacity: 0.9;">${p.category} ${p.subcategory ? `| ${p.subcategory}` : ''}</p>
                        </div>
                        <div style="padding: 15px; display: flex; flex-direction: column; gap: 10px;">
                          
                          <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
                            <div>
                              <strong style="font-size: 11px; color: #475569; text-transform: uppercase;">Price:</strong>
                              <span style="font-size: 13px; font-weight: 800; color: #0f172a; margin-left: 5px;">${p.price ? '₹' + p.price : 'N/A'}</span>
                            </div>
                            <div>
                              <strong style="font-size: 11px; color: #475569; text-transform: uppercase;">Packaging:</strong>
                              <span style="font-size: 12px; font-weight: 600; color: #0f172a; margin-left: 5px;">${p.packagingDetails && p.packagingDetails.length > 0 ? (Array.isArray(p.packagingDetails) ? p.packagingDetails.join(', ') : p.packagingDetails) : 'Standard Packing'}</span>
                            </div>
                          </div>

                          ${p.description || p.desc ? `
                            <div>
                              <strong style="font-size: 11px; color: #059669; text-transform: uppercase;">Description:</strong>
                              <p style="margin: 4px 0 0; font-size: 11px; color: #334155; line-height: 1.5;">${p.description || p.desc}</p>
                            </div>
                          ` : ''}
                          
                          ${p.composition ? `
                            <div>
                              <strong style="font-size: 11px; color: #059669; text-transform: uppercase;">Composition:</strong>
                              <p style="margin: 4px 0 0; font-size: 11px; color: #334155; line-height: 1.5;">${p.composition}</p>
                            </div>
                          ` : ''}

                          ${p.benefits && p.benefits.length > 0 ? `
                            <div>
                              <strong style="font-size: 11px; color: #059669; text-transform: uppercase;">Key Benefits:</strong>
                              <ul style="margin: 4px 0 0; padding-left: 15px; font-size: 11px; color: #334155; line-height: 1.5;">
                                ${Array.isArray(p.benefits) ? p.benefits.map(b => `<li style="margin-bottom: 3px;">${b}</li>`).join('') : `<li>${p.benefits}</li>`}
                              </ul>
                            </div>
                          ` : ''}

                          ${p.recommendedUsage ? `
                            <div>
                              <strong style="font-size: 11px; color: #059669; text-transform: uppercase;">Recommended Usage & Dosage:</strong>
                              <p style="margin: 4px 0 0; font-size: 11px; color: #334155; line-height: 1.5;">${p.recommendedUsage}</p>
                            </div>
                          ` : ''}
                          
                        </div>
                      </div>
                    `).join('')}
                  </div>

                  <h2 style="font-size: 18px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; page-break-before: always;">Crop Fertigation & Care Schedules</h2>
                  <div style="display: flex; flex-direction: column; gap: 15px;">
                    ${crops.map(c => `
                      <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; background-color: #f8fafc; page-break-inside: avoid; margin-bottom: 15px;">
                        <h3 style="margin: 0 0 8px; color: #059669; font-size: 15px; font-weight: 800; text-transform: capitalize;">${c.name}</h3>
                        <p style="margin: 0 0 10px; font-size: 11px; color: #dc2626; font-weight: 600;">Common Threats: ${c.desc || 'N/A'}</p>
                        
                        ${c.schedule ? `
                        <div style="font-size: 11px; color: #334155; line-height: 1.6; margin-bottom: 10px;">
                          ${c.schedule}
                        </div>
                        ` : ''}

                        ${c.fertilizerSchedules && c.fertilizerSchedules.length > 0 ? `
                        <table style="width: 100%; border-collapse: collapse; font-size: 10px; margin-top: 5px;">
                          <thead>
                            <tr style="background-color: #e2e8f0; color: #334155; text-align: left;">
                              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; width: 25%;">Timing</th>
                              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; width: 50%;">Product / Fertilizer</th>
                              <th style="padding: 6px 8px; border: 1px solid #cbd5e1; width: 25%;">Dosage</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${[...c.fertilizerSchedules].sort((a,b) => a.startDay - b.startDay).map(fs => `
                              <tr style="background-color: #ffffff;">
                                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; font-weight: 600; color: #475569;">Day ${fs.startDay} to ${fs.endDay}</td>
                                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #0f172a; font-weight: 700;">${fs.productName}</td>
                                <td style="padding: 6px 8px; border: 1px solid #e2e8f0; color: #059669; font-weight: 700;">${fs.quantity} ${fs.unit}</td>
                              </tr>
                            `).join('')}
                          </tbody>
                        </table>
                        ` : ''}

                        ${!c.schedule && (!c.fertilizerSchedules || c.fertilizerSchedules.length === 0) ? `
                          <p style="margin: 0; color: #94a3b8; font-style: italic; font-size: 11px;">No specific schedule recommended at this time.</p>
                        ` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;

              const html2pdf = (await import('html2pdf.js')).default;
              const element = document.createElement('div');
              element.innerHTML = htmlContent;

              await html2pdf().set({
                margin: 10,
                filename: 'Greengrow_Premium_Catalogue.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
              }).from(element).save();
              
            } catch (err) {
              console.error(err);
              alert("Failed to generate PDF. Please try again.");
            } finally {
              setIsGenerating(false);
            }
          }}
          disabled={isGenerating}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm transition-all text-center shrink-0 w-full sm:w-auto"
        >
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
}

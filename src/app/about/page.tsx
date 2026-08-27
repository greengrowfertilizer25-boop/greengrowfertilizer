"use client";

import { useState } from "react";
import { Leaf, Award, HeartHandshake, X } from "lucide-react";
import Link from "next/link";
import { D2C_SECTION, type D2CSection, ABOUT_COMPANY, type AboutCompany } from "@/data/adminContent";
import { useSettings } from "@/lib/client/useSettings";

export default function AboutPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: d2c } = useSettings<D2CSection>("d2c", D2C_SECTION);
  const { data: about } = useSettings<AboutCompany>("about-company", ABOUT_COMPANY);
  const coreValues = [
    {
      number: "01",
      title: "Farmer First Approach",
      desc: "Our primary objective is to lower the cost of cultivation while improving crop quality and output yield for farmers.",
      icon: HeartHandshake
    },
    {
      number: "02",
      title: "NABL Scientific Trust",
      desc: "Every formulation is manufactured under strict lab testing and complies with NABL certification guidelines.",
      icon: Award
    },
    {
      number: "03",
      title: "Ecological Sustainability",
      desc: "We promote biological, organic, and earth-safe inputs to maintain soil microbes and fertility for future generations.",
      icon: Leaf
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">

      {/* 1. Hero Brand Story Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/60 via-stone-50/30 to-white border border-emerald-100/20 p-8 sm:p-12 md:p-16 text-left max-w-5xl mx-auto shadow-sm">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 max-w-2xl">
          {d2c?.badge && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
              {d2c.badge}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {d2c?.heading || "About Greengrow Fertilizer"}
          </h1>
          
          <div className="pt-4 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-2">Vision Statement</h2>
              <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                {about?.vision}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-emerald-800 mb-2">Mission Statement</h2>
              <p className="text-stone-500 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-line">
                {about?.mission}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(d2c?.bullets || []).map((bullet) => (
              <span key={bullet} className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wide text-emerald-800">
                {bullet}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Directors Details */}
      <section className="space-y-10 max-w-5xl mx-auto">
        <div className="text-left space-y-1.5 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Board of Directors</h2>
          <p className="text-stone-400 text-xs sm:text-sm font-semibold">Leadership behind Greengrow Fertilizer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {about?.directors?.map((director, index) => (
            <div key={index} className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <div 
                className="w-32 h-32 sm:w-40 sm:h-40 bg-stone-200 rounded-full mx-auto mb-4 overflow-hidden border-4 border-emerald-50 cursor-pointer hover:border-emerald-200 transition-colors shadow-sm"
                onClick={() => director.photo && setSelectedImage(director.photo)}
              >
                 {director.photo ? (
                   <img src={director.photo} alt={director.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                 ) : (
                   <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-500 text-[10px] uppercase font-bold text-center px-2">Photo</div>
                 )}
              </div>
              <h3 className="text-lg font-black text-slate-900 text-center">{director.name}</h3>
              <p className="text-xs text-stone-500 leading-relaxed font-medium text-justify whitespace-pre-line">
                {director.description}
              </p>
            </div>
          ))}
          {(!about?.directors || about.directors.length === 0) && (
             <div className="col-span-full py-10 text-center text-stone-400 text-sm font-medium">
               Board of Directors profiles will be updated soon.
             </div>
          )}
        </div>
      </section>

      {/* 3. Visual D2C Comparison Timeline */}
      <section className="space-y-10 max-w-5xl mx-auto">
        <div className="text-left space-y-1.5 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">The Channel Difference</h2>
          <p className="text-stone-400 text-xs sm:text-sm font-semibold">How our factory-to-farm model optimizes agricultural yield costs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

          {/* Traditional Retail Timeline */}
          <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
            <div className="space-y-1 border-b border-stone-100 pb-4">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block">Old supply model</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Traditional Agrochemical Path</h3>
            </div>

            <div className="relative pl-6 border-l border-dashed border-stone-300 space-y-6">
              {[
                { title: "Factory Markups", desc: "Batches get compiled with administrative fees." },
                { title: "National Distributors", desc: "Commissions and bulk fees get tacked onto pricing grids." },
                { title: "State Stockists", desc: "Logistics, storage, and local taxation agents add overheads." },
                { title: "Retail Dealer Grid", desc: "Shopkeepers add profit margins up to 70% to survive." },
                { title: "Farmer Pays High", desc: "Farmer pays inflated rates, often getting expired batches." }
              ].map((step, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <span className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-red-100 border-2 border-red-500 shrink-0" />
                  <h4 className="text-xs font-black text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-stone-500 font-medium">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-50/50 border border-red-100 text-[10px] text-red-600 font-bold p-3.5 rounded-xl uppercase tracking-wide text-center">
              Result: High Cost & Uncertain Shelf-Life
            </div>
          </div>

          {/* Greengrow D2C Timeline */}
          <div className="bg-white border border-emerald-600/30 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden ring-1 ring-emerald-50">
            <div className="space-y-1 border-b border-stone-100 pb-4">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block">Our D2C Path</span>
              <h3 className="text-base sm:text-lg font-black text-slate-900">Greengrow Direct-to-Farm</h3>
            </div>

            <div className="relative pl-6 border-l-2 border-emerald-500 space-y-6">
              {[
                { title: "Direct Synthesis", desc: "Inputs synthesized directly inside our lab facility." },
                { title: "Double Seal Packaging", desc: "Batches sealed leak-proof right at the assembly line." },
                { title: "Zero Middlemen Grid", desc: "All stockists, distributors, and agents are bypassed." },
                { title: "Registered Delivery", desc: "Express logistics ship directly to the farm pin-code." },
                { title: "Lab-Certified Batches", desc: "Farmer receives authentic fresh batches with certificates." }
              ].map((step, idx) => (
                <div key={idx} className="relative space-y-0.5">
                  <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-emerald-600 text-white text-[9px] font-black flex items-center justify-center shrink-0 shadow-sm">
                    ✓
                  </span>
                  <h4 className="text-xs font-black text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-stone-500 font-medium">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-800 font-bold p-3.5 rounded-xl uppercase tracking-wide text-center">
              Result: Save up to 70% direct costs
            </div>
          </div>

        </div>
      </section>

      {/* 3. Core Values with Background Numeric Display Cards */}
      <section className="space-y-10 max-w-5xl mx-auto">
        <div className="text-left space-y-1.5 max-w-xl">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Core Values</h2>
          <p className="text-stone-400 text-xs sm:text-sm font-semibold">The principles driving our crop research and service.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coreValues.map((val) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="group relative overflow-hidden bg-white border border-stone-200/60 p-8 rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 text-left flex flex-col justify-between"
              >
                {/* Background Numeric Indicator */}
                <div className="text-7xl font-black text-stone-50/90 absolute right-6 bottom-4 select-none pointer-events-none group-hover:text-emerald-50/50 transition-colors">
                  {val.number}
                </div>

                <div className="space-y-4 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-650 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-905 leading-tight">{val.title}</h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-medium max-w-[220px]">{val.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Action Banner (Premium Overlay Gradient) */}
      <section className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-emerald-800 shadow-lg">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 max-w-xl text-center md:text-left z-10">
            <h2 className="text-xl sm:text-3xl font-black leading-tight">Explore Certified Organic Nutrients</h2>
            <p className="text-emerald-100/70 text-xs sm:text-sm font-medium">
              Discover our complete range of certified organic manure, mycorrhiza, and chemical crop protectants.
            </p>
          </div>

          <Link
            href="/products"
            className="bg-white text-emerald-950 hover:bg-emerald-50 px-8 py-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition-all text-center shrink-0 w-full md:w-auto z-10"
          >
            Explore Catalog
          </Link>
        </div>
      </section>

      {/* Image Modal for Directors */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 sm:-right-10 sm:-top-10 text-white/70 hover:text-white p-2 bg-slate-900/50 hover:bg-slate-900 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img 
              src={selectedImage} 
              alt="Director Profile" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl ring-1 ring-white/10" 
            />
          </div>
        </div>
      )}

    </div>
  );
}

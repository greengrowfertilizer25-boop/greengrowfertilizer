"use client";

import { useState } from "react";
import { Send, CheckCircle2, ShieldAlert, Award, PiggyBank, Truck, PhoneCall } from "lucide-react";
import { createResource } from "@/lib/client/api";

export default function DealerPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    storeName: "",
    mobileNumber: "",
    emailAddress: "",
    gstin: "",
    distributionArea: "",
    annualTurnover: "Below 5 Lakhs",
    cityState: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createResource("dealers", formData);
      setSubmitted(true);
      setFormData({
        fullName: "",
        storeName: "",
        mobileNumber: "",
        emailAddress: "",
        gstin: "",
        distributionArea: "",
        annualTurnover: "Below 5 Lakhs",
        cityState: "",
        message: ""
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      title: "Excellent Profit Margins",
      desc: "By cutting out national brokers, we supply inputs directly, leaving higher margins for local dealers.",
      icon: PiggyBank
    },
    {
      title: "Scientific Support Hotlines",
      desc: "Get instant assistance from our agronomists to explain dosages to farmers at your counter.",
      icon: PhoneCall
    },
    {
      title: "Assured Premium Quality",
      desc: "Every container has laboratory test reports. Zero adulteration, double-sealed containers.",
      icon: Award
    },
    {
      title: "Flexible Logistics Support",
      desc: "We supply wholesale shipments to your shop or warehouse with reliable delivery partners.",
      icon: Truck
    }
  ];

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4 space-y-8">

      {/* 1. Page Header */}
      <section className="text-left space-y-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
          Partnership Program
        </span>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Become a Dealer or Distributor
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm font-medium max-w-xl">
          Partner with {"India's"} fastest-growing D2C fertilizer brand. Fill out the application below to request margin rates and territory details.
        </p>
      </section>

      {/* 2. Benefits Grid (Mobile First Horizontal Swiper) */}
      <section className="space-y-3.5">
        <h2 className="text-sm font-black text-slate-900 text-left">Partner Benefits</h2>
        <div className="flex gap-4 overflow-x-auto pb-3.5 scrollbar-none snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
          {benefits.map((ben) => {
            const Icon = ben.icon;
            return (
              <div
                key={ben.title}
                className="shrink-0 w-[220px] md:w-full snap-start bg-white border border-stone-200/50 p-4.5 rounded-2xl shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{ben.title}</h3>
                  <p className="text-[10px] text-stone-500 leading-normal font-medium">{ben.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Form Section */}
      <section className="w-full">
        <div className="bg-white border border-stone-200/60 rounded-2xl p-5 sm:p-8 shadow-sm">
          <div className="border-b border-stone-150 pb-4 mb-6">
            <h2 className="text-sm sm:text-base font-black text-slate-950">Partnership Registration Form</h2>
            <p className="text-[10px] sm:text-xs text-stone-400 font-semibold mt-0.5">Submit your business coordinates and territory information.</p>
          </div>

          {submitted ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-0.5">Application Submitted!</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5 leading-normal">
                Thank you. Our sales director will contact you via phone or email within 2-3 business days.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-emerald-650 hover:text-emerald-705 text-xs font-black transition-colors"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Owner Name"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Shop / Company Name *</label>
                  <input
                    type="text"
                    name="storeName"
                    required
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="e.g. Greengrow Agri Agencies"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="WhatsApp Number"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="e.g. contact@yourstore.com"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">GSTIN / PAN</label>
                  <input
                    type="text"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleInputChange}
                    placeholder="Registration Number"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">City & State</label>
                  <input
                    type="text"
                    name="cityState"
                    value={formData.cityState}
                    onChange={handleInputChange}
                    placeholder="e.g. Indore, MP"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Target Distribution Area *</label>
                  <input
                    type="text"
                    name="distributionArea"
                    required
                    value={formData.distributionArea}
                    onChange={handleInputChange}
                    placeholder="e.g. Sehore District"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Annual Turnover</label>
                  <select
                    name="annualTurnover"
                    value={formData.annualTurnover}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  >
                    <option>Below 5 Lakhs</option>
                    <option>5 Lakhs - 20 Lakhs</option>
                    <option>20 Lakhs - 50 Lakhs</option>
                    <option>Above 50 Lakhs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Store Details & Requirements</label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Mention current brands you deal with, store size..."
                  className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all resize-none font-semibold"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-500/10 rounded-xl p-3 flex gap-2.5 text-[10px] text-emerald-800">
                <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-semibold leading-normal">
                  By submitting this form, you authorize Greengrow Fertilizer to verify registration credentials (GSTIN/PAN) and contact you regarding business representation.
                </span>
              </div>

              {submitError && (
                <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-700" role="alert">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-xs"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Dealer Application</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { X, Check, ShoppingBag, ShieldCheck, Mail, Send, CheckCircle2 } from "lucide-react";
import { Product } from "@/data/products";
import { createResource } from "@/lib/client/api";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [activeTab, setActiveTab] = useState<"details" | "enquire">("details");
  const [formData, setFormData] = useState({
    fullName: "",
    farmName: "",
    mobileNumber: "",
    emailAddress: "",
    cityState: "",
    enquiryType: "Customer Inquiry",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createResource("enquiries", {
        ...formData,
        productName: product?.name,
      });
      setSubmitted(true);
      setFormData({
        fullName: "",
        farmName: "",
        mobileNumber: "",
        emailAddress: "",
        cityState: "",
        enquiryType: "Customer Inquiry",
        message: ""
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to send enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Content container */}
      <div className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-slate-100 flex flex-col md:flex-row z-10 animate-in zoom-in-95 duration-200">
        {/* Left Side: Product highlights */}
        <div className="md:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-emerald-500/10">
          <div>
            <div className="flex justify-between items-start">
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <button
                onClick={onClose}
                className="md:hidden p-1.5 rounded-full bg-slate-200/50 hover:bg-slate-200 text-slate-700 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Product Visual (Elegant Organic Packaging Image) */}
            <div className="my-8 flex justify-center">
              <div className="w-48 h-48 rounded-2xl bg-white flex flex-col items-center justify-center text-white shadow-xl shadow-emerald-700/10 border border-slate-100 relative overflow-hidden group">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 mb-2 leading-snug">{product.name}</h2>
              {product.subcategory && (
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">{product.subcategory}</p>
              )}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{product.description}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-500/15">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Available Packaging Sizes</span>
            <div className="flex flex-wrap gap-2">
              {product.packagingDetails.map((size) => (
                <span key={size} className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Tabs (Details or Enquire) */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col max-h-[90vh] md:max-h-[600px] overflow-y-auto">
          {/* Header Close button desktop */}
          <div className="hidden md:flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tab buttons */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => { setActiveTab("details"); setSubmitted(false); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 text-center ${
                activeTab === "details"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Composition & Benefits
            </button>
            <button
              onClick={() => setActiveTab("enquire")}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 text-center ${
                activeTab === "enquire"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Send Enquiry
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "details" ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Chemical / Organic Composition</h4>
                  <p className="text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                    {product.composition}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Key Advantages</h4>
                  <ul className="space-y-2.5">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Application & Dosage</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {product.recommendedUsage}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("enquire")}
                  className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all"
                >
                  <Mail className="w-4 h-4" />
                  <span>Enquire For Pricing & Dealership</span>
                </button>
              </div>
            ) : (
              <div>
                {submitted ? (
                  <div className="text-center py-12 px-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">Enquiry Sent Successfully!</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">
                      Thank you for contacting us. Our sales team or agricultural expert will reach out to you within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setActiveTab("details"); }}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-bold transition-colors"
                    >
                      Back to Product Info
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-slate-500 text-xs mb-4">
                      You are enquiring about: <strong className="text-slate-800">{product.name}</strong>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Farmer / Business Owner Name"
                        className="w-full bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mobile Number</label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          required
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          placeholder="10-digit Mobile"
                          className="w-full bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">City / State</label>
                        <input
                          type="text"
                          name="cityState"
                          required
                          value={formData.cityState}
                          onChange={handleInputChange}
                          placeholder="e.g. Indore, MP"
                          className="w-full bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Company / Farm Name</label>
                        <input
                          type="text"
                          name="farmName"
                          value={formData.farmName}
                          onChange={handleInputChange}
                          placeholder="Optional"
                          className="w-full bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Enquiry Type</label>
                        <select
                          name="enquiryType"
                          value={formData.enquiryType}
                          onChange={handleInputChange}
                          className="w-full bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                        >
                          <option>Customer Inquiry</option>
                          <option>Distributor/Dealer Request</option>
                          <option>Bulk Order Discount</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Message / Requirement</label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Mention required volume or details..."
                        className="w-full bg-slate-50 text-slate-800 text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/15 flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Enquiry</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

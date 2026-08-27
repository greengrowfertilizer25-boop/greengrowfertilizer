"use client";

import { useState } from "react";
import { Send, CheckCircle2, Phone, Mail, MapPin, Clock, ShieldCheck, Users } from "lucide-react";
import { CONTACT_DETAILS, type ContactDetails } from "@/data/adminContent";
import { createResource } from "@/lib/client/api";
import { useSettings } from "@/lib/client/useSettings";

export default function ContactPage() {
  const { data: contact } = useSettings<ContactDetails>("contact-details", CONTACT_DETAILS);
  const [formData, setFormData] = useState({
    fullName: "",
    farmName: "",
    mobileNumber: "",
    emailAddress: "",
    cityState: "",
    enquiryType: "Product Enquiry",
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
      await createResource("enquiries", formData);
      setSubmitted(true);
      setFormData({
        fullName: "",
        farmName: "",
        mobileNumber: "",
        emailAddress: "",
        cityState: "",
        enquiryType: "Product Enquiry",
        message: ""
      });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit your enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-10 max-w-4xl mx-auto px-4 space-y-8">

      {/* 1. Page Header */}
      <section className="text-left space-y-0.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-650">
          Get In Touch
        </span>
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
          We Are Here To Help You
        </h1>
        <p className="text-stone-500 text-xs sm:text-sm font-medium max-w-xl">
          Have queries about application dosages, bulk orders, or shipping speeds? Send us a message, and our agronomists will revert promptly.
        </p>
      </section>

      {/* 2. Grid: Form & Contact details (Form loads first on mobile, columns on desktop) */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

        {/* Enquiry Form Card (Spans 7 columns) */}
        <div className="md:col-span-7 bg-white border border-stone-200/60 rounded-2xl p-5 sm:p-8 shadow-sm order-1">
          <div className="border-b border-stone-150 pb-4 mb-5">
            <h2 className="text-sm sm:text-base font-black text-slate-950">Send Corporate Enquiry</h2>
            <p className="text-[10px] sm:text-xs text-stone-400 font-semibold mt-0.5">Fill out your details to get support.</p>
          </div>

          {submitted ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-slate-900 mb-0.5">Enquiry Forwarded!</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto mb-5 leading-normal">
                Your message has been sent. An agricultural advisor will contact you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-emerald-650 hover:text-emerald-705 text-xs font-black transition-colors"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="emailAddress"
                    required
                    value={formData.emailAddress}
                    onChange={handleInputChange}
                    placeholder="name@domain.com"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Farm / Company Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="farmName"
                    required
                    value={formData.farmName}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Enquiry Type</label>
                  <select
                    name="enquiryType"
                    value={formData.enquiryType}
                    onChange={handleInputChange}
                    className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                  >
                    <option>Product Enquiry</option>
                    <option>Dealer Partnership</option>
                    <option>Bulk Farm Procurement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">City & State</label>
                <input
                  type="text"
                  name="cityState"
                  required
                  value={formData.cityState}
                  onChange={handleInputChange}
                  placeholder="e.g. Indore, MP"
                  className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-500 uppercase tracking-wider mb-1.5">Message / Requirements <span className="text-red-500">*</span></label>
                <textarea
                  name="message"
                  required
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Explain your farming concerns or required product list..."
                  className="w-full bg-stone-50 text-slate-800 text-xs p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:bg-white transition-all resize-none font-semibold"
                />
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
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Info Cards (Spans 5 columns, loads second on mobile) */}
        <div className="md:col-span-5 space-y-6 order-2">
          <div className="bg-white border border-stone-200/50 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 text-left">
            <h2 className="text-sm sm:text-base font-black text-slate-955 border-b border-stone-150 pb-3">Greengrow Office Details</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-stone-400 uppercase tracking-wider">Corporate Headquarters</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5 leading-relaxed">
                    {contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-stone-400 uppercase tracking-wider">Call Support</span>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="block text-xs font-bold text-slate-700 hover:text-emerald-600 mt-0.5">
                    {contact.phone}
                  </a>
                  <span className="block text-[8px] text-stone-400">Direct sales line & dealership cell</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-stone-400 uppercase tracking-wider">Email Inquiry</span>
                  <a href={`mailto:${contact.email}`} className="block text-xs font-bold text-slate-700 hover:text-emerald-600 mt-0.5">
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-stone-400 uppercase tracking-wider">Office Hours</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    {contact.officeHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 border-t border-stone-150 pt-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-stone-400 uppercase tracking-wider">Corporate Registration</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">
                    {contact.companyName}<br />
                    <span className="text-[10px] text-stone-400 font-normal block mt-0.5">CIN: {contact.cin}</span>
                    <span className="text-[10px] text-stone-400 font-normal block">GSTIN: {contact.gstin}</span>
                  </p>
                </div>
              </div>


            </div>
          </div>

          {/* Interactive Google Map Iframe */}
          <div className="w-full h-[220px] rounded-2xl overflow-hidden border border-stone-200/50 relative shadow-sm">
            <iframe
              src="https://maps.google.com/maps?q=Radhika%20Premier%20Building%20Indore&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </section>
    </div>
  );
}

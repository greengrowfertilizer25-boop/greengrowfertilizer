"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { CONTACT_DETAILS, type ContactDetails } from "@/data/adminContent";
import { useSettings } from "@/lib/client/useSettings";

export default function WhatsAppWidget() {
  const pathname = usePathname();
  const { data: contact } = useSettings<ContactDetails>("contact-details", CONTACT_DETAILS);
  const whatsappNum = (contact?.whatsapp || "").replace(/\D/g, "");
  const message = encodeURIComponent(`Hello ${contact?.brandName || "Greengrow Fertilizer"}! I am interested in your products and would like to receive product catalogues and dealer options.`);
  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${message}`;

  if (pathname === "/" || !whatsappNum) {
    return null;
  }

  return (
    <div className="hidden md:block fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300"
        title="Chat with us on WhatsApp"
      >
        {/* Glow effect */}
        <span className="absolute -inset-0.5 rounded-full bg-emerald-500 opacity-75 blur animate-ping group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Main button */}
        <div className="relative flex items-center justify-center w-full h-full rounded-full bg-emerald-500 group-hover:bg-emerald-600">
          <MessageCircle className="w-7 h-7 fill-current" />
        </div>

        {/* Tooltip */}
        <div className="absolute right-16 scale-0 group-hover:scale-100 transition-transform origin-right bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
          Chat on WhatsApp
        </div>
      </a>
    </div>
  );
}

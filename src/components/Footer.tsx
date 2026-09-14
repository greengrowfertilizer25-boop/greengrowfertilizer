"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { CONTACT_DETAILS, CATEGORY_ITEMS, type ContactDetails, type CategoryItem } from "@/data/adminContent";
import { useSettings } from "@/lib/client/useSettings";
import { useResource } from "@/lib/client/useResource";

export default function Footer() {
  const { data: contact } = useSettings<ContactDetails>("contact-details", CONTACT_DETAILS);
  const { items: categories } = useResource<CategoryItem>("categories", CATEGORY_ITEMS);

  const sortedCategories = [...categories].sort((a, b) => {
    const orderA = a.order ?? 999;
    const orderB = b.order ?? 999;
    return orderA - orderB;
  });

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Products", href: "/products" },
    { name: "Product Categories", href: "/categories" },
    { name: "Dealer / Distributor Form", href: "/dealer" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy & Terms", href: "/privacy" }
  ];

  const whatsappNumber = contact?.whatsapp || "";
  const formattedPhone = contact?.phone || "";
  const cleanPhone = formattedPhone.replace(/\s/g, "");

  return (
    <footer className="bg-stone-50 text-stone-600 border-t border-stone-200/80 pt-16 pb-10">
      {/* 1. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Column 1: Brand Info */}
        <div className="space-y-4 text-left">
          <Link href="/" className="flex items-center gap-2">
            {contact?.logo && (
              <img 
                src={contact.logo} 
                alt={contact?.brandName || "Company Logo"} 
                className="h-12 sm:h-14 w-auto object-contain shrink-0" 
              />
            )}
            {contact?.brandName && (
              <div>
                <span className="text-base font-black tracking-tight text-slate-900 block">{contact.brandName}</span>
                {contact?.brandTagline && (
                  <span className="text-[9px] uppercase tracking-widest text-emerald-650 font-bold block -mt-1">{contact.brandTagline}</span>
                )}
              </div>
            )}
          </Link>
          {contact?.brandDescription && (
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-medium">
              {contact.brandDescription}
            </p>
          )}
          
          {/* Social Links */}
          <div className="flex items-center gap-2.5 pt-1">
            {contact?.socials?.facebook && (
              <a href={contact.socials.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-600/30 transition-all shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
            )}
            {contact?.socials?.instagram && (
              <a href={contact.socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-600/30 transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            )}
            {contact?.socials?.twitter && (
              <a href={contact.socials.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-600/30 transition-all shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Solutions Categories */}
        <div className="space-y-4 text-left">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest">Solutions</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
            {sortedCategories.map((cat) => (
              <li key={cat.id}>
                {cat.isComingSoon ? (
                  <span className="text-stone-400 cursor-not-allowed flex items-center gap-2">
                    {cat.name} Solutions <span className="text-[7px] uppercase tracking-wider text-rose-500 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">Coming Soon</span>
                  </span>
                ) : (
                  <Link href={`/products?category=${cat.name}`} className="hover:text-emerald-650 transition-colors">
                    {cat.name} Solutions
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Navigation Links */}
        <div className="space-y-4 text-left">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest">Quick Links</h4>
          <ul className="space-y-2.5 text-xs sm:text-sm font-bold">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="hover:text-emerald-655 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact & Support */}
        <div className="space-y-4 text-left">
          <h4 className="text-slate-900 text-xs font-black uppercase tracking-widest">Corporate Office</h4>
          <div className="space-y-3.5 text-xs sm:text-sm font-bold text-stone-500">
            {contact?.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-normal whitespace-pre-line">
                  {contact.address}
                </p>
              </div>
            )}
            {formattedPhone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`tel:${cleanPhone}`} className="hover:text-emerald-650 transition-colors">
                  {formattedPhone}
                </a>
              </div>
            )}
            {contact?.email && (
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-emerald-650 transition-colors">
                  {contact.email}
                </a>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. Bottom Copyright and links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mt-6 border-t border-stone-200/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-stone-500">
        <div className="text-center sm:text-left space-y-1">
          {contact?.companyName && (
            <p>© {new Date().getFullYear()} {contact.companyName}. All rights reserved.</p>
          )}
          {contact?.cin && (
            <p className="text-[10px] text-stone-400 font-normal">CIN: {contact.cin}</p>
          )}
          <p className="text-[10px] text-stone-400 font-normal pt-0.5">
            Developed by <a href="https://www.softuitionitsolutions.com/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 hover:underline transition-colors">Softuition IT Solutions</a>
          </p>
        </div>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-stone-700">Privacy Policy</Link>
          <Link href="/privacy" className="hover:text-stone-700">Terms of Service</Link>
          {whatsappNumber && (
            <a href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-emerald-650 hover:text-emerald-700 flex items-center gap-1">
              WhatsApp Support <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

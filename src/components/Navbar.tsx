"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Users, PhoneCall, Search, Leaf, Sparkles, Layers, Heart } from "lucide-react";

import { CONTACT_DETAILS, type ContactDetails } from "@/data/adminContent";
import { useSettings } from "@/lib/client/useSettings";

export default function Navbar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: contact } = useSettings<ContactDetails>("contact-details", CONTACT_DETAILS);

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: ShoppingBag },
    { name: "Categories", href: "/categories", icon: Layers },
    { name: "Dealer", href: "/dealer", icon: Users },
    { name: "About Us", href: "/about", icon: Heart },
    { name: "Contact", href: "/contact", icon: PhoneCall },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const phoneLink = `tel:${(contact?.phone || "+918269108808").replace(/\s/g, "")}`;

  return (
    <>
      {/* ================= HEADER NAVIGATION ================= */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-sm px-4 md:px-8 py-2.5 md:py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          
          {/* Top Row: Logo, Desktop Nav, Mobile Call/Branding */}
          <div className="flex justify-between items-center w-full md:w-auto">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <img 
                src={contact?.logo || "/assets/company_logo.png"} 
                alt={contact?.brandName || "Greengrow Fertilizer Logo"} 
                className="h-8 sm:h-9 w-auto object-contain" 
              />
              <div>
                <span className="text-sm font-black tracking-tight text-slate-900 block leading-none">{contact?.brandName || "GREENGROW FERTILIZER"}</span>
              {contact?.brandTagline && (
                <span className="text-[7px] uppercase tracking-widest text-emerald-650 font-extrabold block mt-0.5">{contact.brandTagline}</span>
              )}
              </div>
            </Link>

            {/* Mobile Call Icon (Only on mobile top header) */}
            <div className="flex md:hidden items-center gap-2">
              <a href={phoneLink} className="p-2 text-emerald-605 bg-emerald-50 rounded-xl transition-colors">
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Desktop Navigation Links (Only shown on Desktop, thin & centered) */}
          <nav className="hidden md:flex items-center gap-6 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-extrabold uppercase tracking-widest transition-colors relative py-1 ${
                    isActive ? "text-emerald-700" : "text-stone-500 hover:text-emerald-600"
                  }`}
                >
                  {link.name}
                  {isActive && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600 rounded-full" />}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar & Call CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Bar: Full width on mobile, compact on desktop */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full md:w-56 shrink-0">
              <input
                type="text"
                placeholder="Search products, crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-stone-50 text-slate-800 text-xs px-3.5 py-2 pl-9 pr-4 rounded-xl border border-stone-200 focus:outline-none focus:ring-1.5 focus:ring-emerald-500 focus:bg-white w-full transition-all"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3" />
            </form>

            {/* Desktop Action Call Button */}
            <a
              href="tel:+918269108808"
              className="hidden md:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-sm shadow-emerald-700/10 shrink-0"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Advisor</span>
            </a>
          </div>

        </div>
      </header>

      {/* ================= MOBILE BOTTOM APP NAVIGATION BAR ================= */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200/80 h-15 px-6 z-40 flex justify-between items-center shadow-lg pb-safe">
        {navLinks.filter(l => l.name !== "About Us").map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
                isActive ? "text-emerald-650 scale-102" : "text-stone-400 hover:text-stone-605"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px]" : "stroke-[2px]"}`} />
              <span className="text-[9px] font-extrabold tracking-tight leading-none">
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

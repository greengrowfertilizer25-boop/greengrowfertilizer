"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";
import { CONTACT_DETAILS, type ContactDetails } from "@/data/adminContent";
import { useSettings } from "@/lib/client/useSettings";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const { data: contact } = useSettings<ContactDetails>("contact-details", CONTACT_DETAILS);

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-opacity duration-1000 ease-out">
      <div className="flex flex-col items-center">
        {/* Elegant Logo Container */}
        <div className="relative w-52 h-52 mb-8 ">
          <img
            src={contact?.logo || ""}
            alt={contact?.brandName || "Green Gro Fertilizer"}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Kinetic Text Loader */}
        <div className="mt-4">
          <KineticTextLoader className="text-emerald-500 [&_.bg-neutral-800]:bg-emerald-500 [&_.dark\\:bg-neutral-200]:bg-emerald-500 [&_p]:text-emerald-500 [&_.dark\\:text-neutral-200]:text-emerald-500" />
        </div>
      </div>
    </div>
  );
}

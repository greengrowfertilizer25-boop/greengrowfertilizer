"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
          {contact?.logo && (
            <img 
              src={contact.logo} 
              alt={contact?.brandName || "Company Logo"} 
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain mx-auto" 
            />
          )}
      </div>
    </div>
  );
}

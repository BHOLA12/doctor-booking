"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface MedicineImageProps {
  src?: string | null;
  category: string;
  alt: string;
  className?: string;
}

export default function MedicineImage({ src, category, alt, className }: MedicineImageProps) {
  // Normalize category name to match our generated graphics: tablet, capsule, syrup, injection
  const getNormalizedCategory = (cat: string): string => {
    const c = (cat || "").toLowerCase();
    if (
      c.includes("tablet") || 
      c.includes("pain") || 
      c.includes("cold") || 
      c.includes("fever") || 
      c.includes("diabetes") || 
      c.includes("heart") || 
      c.includes("bp") || 
      c.includes("antibiotics")
    ) {
      return "tablet";
    }
    if (
      c.includes("capsule") || 
      c.includes("vitamin") || 
      c.includes("supplement")
    ) {
      return "capsule";
    }
    if (
      c.includes("syrup") || 
      c.includes("suspension") || 
      c.includes("digestive") || 
      c.includes("gel")
    ) {
      return "syrup";
    }
    if (
      c.includes("injection") || 
      c.includes("vial") || 
      c.includes("vaccine")
    ) {
      return "injection";
    }
    return "tablet"; // Default fallback
  };

  const normCategory = getNormalizedCategory(category);
  const placeholderPath = `/images/categories/${normCategory}.webp`;

  // Initialize with src if available, otherwise use category webp placeholder
  const [imgSrc, setImgSrc] = useState<string>(src || placeholderPath);
  const [isFallback, setIsFallback] = useState<boolean>(!src);

  // Sync state if src changes dynamically (e.g. after background scraping updates it)
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setIsFallback(false);
    } else {
      setImgSrc(placeholderPath);
      setIsFallback(true);
    }
  }, [src, placeholderPath]);

  const handleError = () => {
    // If the main image fails to load, gracefully switch to category placeholder
    if (!isFallback) {
      setImgSrc(placeholderPath);
      setIsFallback(true);
    }
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className || "w-full h-full"}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="transition-all duration-300 object-contain group-hover:scale-105"
        onError={handleError}
        priority={!src} // Priority load placeholders to prevent layout shift
      />
    </div>
  );
}

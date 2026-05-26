"use client";

import React, { useState, useEffect } from "react";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export default function FallbackImage({
  src,
  alt,
  fallbackSrc = "/hospital-placeholder.jpg",
  className,
  ...props
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState<string>((src as string) || fallbackSrc);

  useEffect(() => {
    setImgSrc((src as string) || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <img
      {...props}
      className={className}
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

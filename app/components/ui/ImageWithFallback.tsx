"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
  alt: string;
  className?: string;
};

export function ImageWithFallback({
  src,
  fallbackSrc = "/images/profiles/profile-fallback.svg",
  alt,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = hasError || !src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      unoptimized={props.unoptimized ?? false}
    />
  );
}

import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

/**
 * CareerMonke Brand Logo Icon
 * Uses the custom vector SVG of the CareerMonke mascot.
 */
export default function BrandIcon({
  className = "w-6 h-6",
  size,
}: BrandIconProps) {
  return (
    <img
      src="/careermonke.svg"
      alt="CareerMonke"
      width={size || 36}
      height={size || 36}
      className={`select-none object-contain ${className}`}
      draggable={false}
    />
  );
}

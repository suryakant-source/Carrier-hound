import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

export default function BrandIcon({ className = "w-6 h-6 text-[#2563EB]", size }: BrandIconProps) {
  return (
    <svg
      width={size || "100%"}
      height={size || "100%"}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Head top curve */}
      <path
        d="M12 9.5C13.5 8 15 7.5 18 7.5C21 7.5 22.5 8 24 9.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Left Floppy Ear */}
      <path
        d="M12 9.5C8.5 10 5.5 13.5 5.5 17.5C5.5 21.5 8 23 10.5 21C11.5 20.2 12 18.5 12 17"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Floppy Ear */}
      <path
        d="M24 9.5C27.5 10 30.5 13.5 30.5 17.5C30.5 21.5 28 23 25.5 21C24.5 20.2 24 18.5 24 17"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Lower Face & Chin */}
      <path
        d="M10.5 18C10 23.5 13 28 18 28C23 28 26 23.5 25.5 18"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Left Eye */}
      <circle cx="14" cy="15" r="1.5" fill="currentColor" />
      {/* Right Eye */}
      <circle cx="22" cy="15" r="1.5" fill="currentColor" />
      {/* Nose */}
      <path
        d="M16 19.5C16.8 18.8 19.2 18.8 20 19.5C20.5 20 19.5 21.2 18 21.2C16.5 21.2 15.5 20 16 19.5Z"
        fill="currentColor"
      />
      {/* Mouth */}
      <path
        d="M15.5 22.5C16.5 23.8 19.5 23.8 20.5 22.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "salary" | "source" | "blue" | "outline";
  className?: string;
  onClick?: () => void;
}

export default function Chip({
  children,
  variant = "default",
  className,
  onClick,
}: ChipProps) {
  const variantStyles = {
    default: "bg-gray-50 border-[#E4E4E7] text-[#4B5563]",
    salary: "bg-[#DCFCE7] border-[#BBF7D0] text-[#166534] font-medium", // light green background + dark green text
    source: "bg-gray-100 border-[#E4E4E7] text-[#4B5563]",
    blue: "bg-blue-50 border-blue-200 text-[#2563EB] font-medium",
    outline: "bg-transparent border-[#E4E4E7] text-[#09090B] hover:border-gray-400",
  };

  const isInteractive = !!onClick;

  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-[0.9rem] py-[0.4rem] text-[0.88rem] leading-none transition-colors",
        variantStyles[variant],
        isInteractive && "cursor-pointer hover:opacity-80",
        className
      )}
    >
      {children}
    </span>
  );
}

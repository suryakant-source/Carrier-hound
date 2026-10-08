import React, { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function PrimaryButton({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center bg-[#2563EB] text-white px-7 py-3 min-h-[44px] rounded-[6px] font-medium text-base transition-all duration-150 ease-in-out hover:bg-[#1D4ED8] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function WhiteHeroButton({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 bg-white text-[#09090B] font-semibold text-base px-6 h-[56px] min-h-[48px] min-w-[175px] rounded-[6px] shadow-sm transition-all duration-150 ease-in-out hover:bg-gray-100 hover:text-black active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 cursor-pointer",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

export function GhostButton({
  children,
  className,
  onBlue = false,
  ...props
}: ButtonProps & { onBlue?: boolean }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center px-7 py-3 min-h-[44px] rounded-[6px] font-medium text-base transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 active:scale-[0.98] cursor-pointer",
        onBlue
          ? "bg-transparent text-white border border-white/40 hover:bg-white/10 focus-visible:ring-white"
          : "bg-transparent text-[#09090B] border border-[#E4E4E7] hover:bg-gray-50 focus-visible:ring-blue-600",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlineSmallButton({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium text-gray-500 p-3 min-h-[44px] min-w-[44px] border border-gray-300 rounded-md hover:bg-slate-100 hover:text-gray-900 active:scale-[0.98] transition-colors duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}


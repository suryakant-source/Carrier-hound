/**
 * Centralized Design System & Theme Configuration
 * CareerMonke / CareerHound
 * 
 * Strict specifications:
 * - Brand Colors: Primary #2563EB, Primary Hover #1D4ED8, Foreground #09090B, Muted #4B5563, Border #E4E4E7
 * - Subtle transitions under 200ms (duration-150)
 * - Mobile tap targets at least 44px (min-h-[44px], min-w-[44px])
 * - WCAG AA compliant contrast ratios
 */

export const THEME = {
  colors: {
    brand: {
      primary: "#2563EB",
      primaryHover: "#1D4ED8",
      primaryLight: "#EFF6FF",
      navy: "#090E34",
      darkBg: "#040610",
      foreground: "#09090B",
      muted: "#4B5563",
      border: "#E4E4E7",
      bgLight: "#F8FAFC",
      bgFaq: "#F3F4F6",
      bgContact: "#F9FAFB",
    },
    status: {
      success: "#10B981", // emerald-500
      successBg: "#ECFDF5", // emerald-50
      successBorder: "#A7F3D0", // emerald-200
      warning: "#F59E0B", // amber-500
      warningBg: "#FFFBEB", // amber-50
      warningBorder: "#FDE68A", // amber-200
      error: "#EF4444", // red-500
      errorBg: "#FEF2F2", // red-50
      errorBorder: "#FECACA", // red-200
      info: "#3B82F6", // blue-500
      infoBg: "#EFF6FF", // blue-50
      infoBorder: "#BFDBFE", // blue-200
    },
    stages: {
      saved: { text: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
      applied: { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
      interview: { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
      offer: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
      rejected: { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
    },
  },
  typography: {
    fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
      xs: "text-xs", // 12px
      sm: "text-sm", // 14px
      base: "text-base", // 16px (mobile-safe)
      lg: "text-lg", // 18px
      xl: "text-xl", // 20px
      "2xl": "text-2xl", // 24px
      "3xl": "text-3xl", // 30px
      "4xl": "text-4xl", // 36px
    },
  },
  radius: {
    sm: "rounded-md", // 6px
    md: "rounded-lg", // 8px
    lg: "rounded-xl", // 12px
    full: "rounded-full",
  },
  shadows: {
    sm: "shadow-xs",
    card: "shadow-sm hover:shadow-md",
    modal: "shadow-2xl",
  },
  transitions: {
    fast: "transition-all duration-150 ease-in-out",
    color: "transition-colors duration-150 ease-in-out",
  },
  touchTarget: "min-h-[44px] min-w-[44px]",
} as const;

/**
 * Standardized utility class presets for high UI consistency
 */
export const UI_CLASSES = {
  // Buttons
  buttonPrimary:
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  buttonSecondary:
    "inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] bg-white hover:bg-slate-50 active:scale-[0.98] text-[#09090B] border border-[#E4E4E7] font-medium text-sm rounded-xl shadow-xs transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  buttonGhost:
    "inline-flex items-center justify-center gap-1.5 px-3 py-2 min-h-[44px] text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-[0.98] font-medium text-xs sm:text-sm rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] cursor-pointer",
  buttonDanger:
    "inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-50 cursor-pointer",

  // Inputs
  inputBase:
    "w-full min-h-[44px] px-3.5 py-2.5 bg-white text-[#09090B] text-base placeholder:text-slate-400 border border-[#E4E4E7] rounded-xl shadow-xs transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] disabled:bg-slate-100 disabled:cursor-not-allowed",
  inputError:
    "w-full min-h-[44px] px-3.5 py-2.5 bg-white text-[#09090B] text-base placeholder:text-slate-400 border border-rose-500 rounded-xl shadow-xs transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500",

  // Cards
  cardBase:
    "bg-white border border-[#E4E4E7] rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out",
  cardInteractive:
    "bg-white border border-[#E4E4E7] rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-150 ease-in-out cursor-pointer",

  // Modals & Dialogs
  modalBackdrop:
    "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-150",
  modalDialog:
    "relative w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92dvh] transition-transform duration-150",
  modalCloseButton:
    "w-10 h-10 min-h-[44px] min-w-[44px] rounded-full bg-black/10 sm:bg-white/10 hover:bg-black/20 sm:hover:bg-white/20 text-current flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",

  // Skeleton loading
  skeletonLine: "bg-slate-200 rounded-md animate-pulse",
  skeletonCard: "bg-white border border-[#E4E4E7] rounded-xl p-6 shadow-sm animate-pulse space-y-4",

  // State Containers
  emptyState:
    "bg-white border border-[#E4E4E7] rounded-xl p-10 sm:p-12 text-center space-y-4 shadow-xs",
  errorState:
    "bg-white border border-rose-200 rounded-xl p-8 sm:p-10 text-center space-y-3 shadow-xs",
};

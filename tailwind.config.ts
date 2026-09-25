import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          hover: "#1D4ED8",
        },
        brand: {
          blue: "#2563EB",
          blueHover: "#1D4ED8",
          blueTint: "#F8FAFF",
          navy: "#090E34",
          headlineInk: "#142033",
          foreground: "#09090B",
          muted: "#4B5563",
          guideText: "rgb(99, 115, 129)",
          border: "#E4E4E7",
          softBlueBorder: "#DBE3EF",
          faqBg: "#F3F4F6",
          contactBg: "#F9FAFB",
          star: "#EAB308",
        },
      },
      maxWidth: {
        content: "1120px",
      },
      borderRadius: {
        btn: "6px",
        card: "8px",
        panel: "12px",
        megamenu: "14px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(15,23,42,0.12)",
        megamenu: "0 20px 50px rgba(9,14,52,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;

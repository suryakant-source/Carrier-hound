import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/onboarding"],
    },
    sitemap: "https://yourbrand-jobs.example.com/sitemap.xml",
  };
}

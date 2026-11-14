
import type { MetadataRoute } from "next";

const BASE_URL = "https://salon-booking-platform-8e9k.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

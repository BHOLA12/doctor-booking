import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/doctors", "/medicines", "/lab-tests", "/hospitals", "/blog"],
        disallow: [
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/orders/",
        ],
      },
    ],
    sitemap: "https://docbook.health/sitemap.xml",
  };
}

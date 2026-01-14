import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/", // Запрещаем индексировать внутренние запросы
    },
    sitemap: "https://subs.viktoor.ru/sitemap.xml",
  };
}

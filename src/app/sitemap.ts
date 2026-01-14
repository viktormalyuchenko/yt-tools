import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yt.viktoor.ru";
  const langs = ["ru", "en", "es"];

  return langs.map((lng) => ({
    url: `${baseUrl}/${lng}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1.0,
  }));
}

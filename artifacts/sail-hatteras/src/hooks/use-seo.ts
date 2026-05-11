import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
  type?: "website" | "article";
}

const SITE_NAME = "Hatteras Community Sailing";
const DEFAULT_IMAGE = "https://sailhatteras.org/opengraph.jpg";
const BASE_URL = "https://sailhatteras.org";

function setMeta(property: string, content: string, attr: "property" | "name" = "property") {
  let el = document.querySelector(`meta[${attr}="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setJsonLd(id: string, data: object) {
  let el = document.querySelector(`script[data-seo="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function useSeo(options: SeoOptions & { jsonLd?: object | object[] }) {
  const { title, description, image = DEFAULT_IMAGE, canonical, type = "website", jsonLd } = options;

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : BASE_URL;
  const imageUrl = image.startsWith("http") ? image : `${BASE_URL}/${image.replace(/^\//, "")}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta("description", description, "name");
    setMeta("robots", "index, follow", "name");

    setMeta("og:type", type);
    setMeta("og:url", canonicalUrl);
    setMeta("og:title", fullTitle);
    setMeta("og:description", description);
    setMeta("og:image", imageUrl);
    setMeta("og:image:width", "1200");
    setMeta("og:image:height", "630");
    setMeta("og:site_name", SITE_NAME);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", imageUrl, "name");

    setLink("canonical", canonicalUrl);

    if (jsonLd) {
      const items = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      items.forEach((item, i) => setJsonLd(`ld-${i}`, item));
    }
  }, [fullTitle, description, imageUrl, canonicalUrl, type, jsonLd]);
}

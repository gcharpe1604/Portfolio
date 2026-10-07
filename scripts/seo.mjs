import {
  normalizePath,
  routeMetadata,
  notFoundMetadata,
  structuredData,
} from "../src/data/seo.js";

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );

export function seoHead(pathname, siteUrl, robotsDirective) {
  const path = normalizePath(pathname);
  const metadata = routeMetadata[path] || notFoundMetadata;
  const url = `${siteUrl}${path}`;
  const image = `${siteUrl}${metadata.image}`;
  const robots = routeMetadata[path] ? robotsDirective : "noindex, follow";
  const meta = (kind, name, content) =>
    `<meta ${kind}="${name}" content="${escapeHtml(content)}" />`;
  return [
    `<title>${escapeHtml(metadata.title)}</title>`,
    meta("name", "description", metadata.description),
    meta("name", "author", "Govind Charpe"),
    `<meta name="robots" content="${robots}" data-default-content="${robotsDirective}" />`,
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    meta("property", "og:site_name", "Govind Charpe"),
    meta("property", "og:type", "website"),
    meta("property", "og:title", metadata.title),
    meta("property", "og:description", metadata.description),
    meta("property", "og:url", url),
    meta("property", "og:image", image),
    meta("property", "og:image:alt", metadata.imageAlt),
    meta("property", "og:image:width", "1200"),
    meta("property", "og:image:height", "630"),
    meta("property", "og:image:type", "image/png"),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:title", metadata.title),
    meta("name", "twitter:description", metadata.description),
    meta("name", "twitter:image", image),
    meta("name", "twitter:image:alt", metadata.imageAlt),
    `<script id="page-structured-data" type="application/ld+json">${JSON.stringify(structuredData(path, siteUrl)).replaceAll("<", "\\u003c")}</script>`,
  ].join("\n    ");
}

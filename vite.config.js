import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const indexableRoutes = [
  "/",
  "/work/gitanalyzer",
  "/work/leadflow",
  "/open-source",
  "/resume",
];

export default defineConfig(() => {
  const siteUrl = (
    process.env.URL ||
    process.env.VITE_SITE_URL ||
    "https://govind-charpe.netlify.app"
  ).replace(/\/$/, "");
  const isDeployPreview = process.env.CONTEXT === "deploy-preview";
  const robotsDirective = isDeployPreview
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return {
    plugins: [
      react(),
      {
        name: "portfolio-seo-assets",
        transformIndexHtml: {
          order: "pre",
          handler(html) {
            return html
              .replaceAll("__SITE_URL__", siteUrl)
              .replaceAll("__ROBOTS_DIRECTIVE__", robotsDirective);
          },
        },
        generateBundle() {
          const robots = [
            "User-agent: *",
            isDeployPreview ? "Disallow: /" : "Allow: /",
            ...(siteUrl && !isDeployPreview
              ? [`Sitemap: ${siteUrl}/sitemap.xml`]
              : []),
            "",
          ].join("\n");
          this.emitFile({
            type: "asset",
            fileName: "robots.txt",
            source: robots,
          });

          if (siteUrl && !isDeployPreview) {
            const sitemapEntries = indexableRoutes
              .map(
                (route) =>
                  `  <url><loc>${siteUrl}${route}</loc><changefreq>monthly</changefreq></url>`,
              )
              .join("\n");
            this.emitFile({
              type: "asset",
              fileName: "sitemap.xml",
              source: [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
                sitemapEntries,
                "</urlset>",
                "",
              ].join("\n"),
            });
          }
        },
      },
    ],
    server: {
      host: "127.0.0.1",
    },
    preview: {
      host: "127.0.0.1",
    },
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      css: true,
    },
    build: {
      sourcemap: true,
    },
  };
});

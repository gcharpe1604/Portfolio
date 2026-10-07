import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { routeMetadata, resolveSiteUrl } from "./src/data/seo.js";
import { seoHead } from "./scripts/seo.mjs";

const indexableRoutes = Object.keys(routeMetadata);

export default defineConfig(() => {
  const siteUrl = resolveSiteUrl(process.env);
  const isDeployPreview = process.env.CONTEXT === "deploy-preview";
  const robotsDirective = isDeployPreview
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  return {
    define: { "import.meta.env.VITE_SITE_URL": JSON.stringify(siteUrl) },
    plugins: [
      react(),
      {
        name: "portfolio-seo-assets",
        transformIndexHtml: {
          order: "pre",
          handler(html) {
            return html.replace(
              "__SEO_HEAD__",
              seoHead("/", siteUrl, robotsDirective),
            );
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

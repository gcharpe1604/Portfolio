import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { build, createServer } from "vite";
import { routeMetadata, resolveSiteUrl } from "../src/data/seo.js";
import { seoHead } from "./seo.mjs";

await build({ build: { manifest: true } });
const siteUrl = resolveSiteUrl(process.env);
const robots =
  process.env.CONTEXT === "deploy-preview"
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const template = await readFile("dist/index.html", "utf8");
if (
  !template.includes('<div id="root"></div>') ||
  !template.includes("<!--seo-start-->")
) {
  throw new Error(
    "The HTML template is missing its prerender or SEO placeholder.",
  );
}
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const css = [
  ...new Set(Object.values(manifest).flatMap((entry) => entry.css || [])),
]
  .filter((file) => !template.includes(`href="/${file}"`))
  .map((file) => `<link rel="stylesheet" href="/${file}" />`)
  .join("\n");
const server = await createServer({
  mode: "production",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});
try {
  const { render } = await server.ssrLoadModule("/src/entry-server.jsx");
  for (const route of [...Object.keys(routeMetadata), "/404"]) {
    const content = await render(route);
    if (!content.includes("<h1"))
      throw new Error(`Prerender missing page content: ${route}`);
    const html = template
      .replace(
        /<!--seo-start-->[\s\S]*?<!--seo-end-->/,
        `<!--seo-start-->${seoHead(route, siteUrl, robots)}<!--seo-end-->`,
      )
      .replace(
        /<noscript>[\s\S]*?<\/noscript>/,
        "<noscript><style>.lab-stage-content{opacity:1!important;transform:none!important;filter:none!important}</style></noscript>",
      )
      .replace(
        '<div id="root"></div>',
        `<div id="root" data-prerendered="true">${content}</div>`,
      )
      .replace("</head>", `${css}\n</head>`);
    const destination =
      route === "/"
        ? "dist/index.html"
        : route === "/404"
          ? "dist/404.html"
          : path.join("dist", route.slice(1), "index.html");
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
    process.stdout.write(`Prerendered ${route}\n`);
  }
} finally {
  await server.close();
}

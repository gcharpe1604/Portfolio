import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { seoHead } from "../../scripts/seo.mjs";
import { resolveSiteUrl } from "../data/seo";

describe("portfolio SEO", () => {
  it("gives direct project URLs their own canonical and social preview", () => {
    const document = new JSDOM(
      `<head>${seoHead("/work/leadflow/", "https://portfolio.example", "index, follow")}</head>`,
    ).window.document;
    expect(document.title).toBe("LeadFlow Case Study — Govind Charpe");
    expect(document.querySelector('link[rel="canonical"]').href).toBe(
      "https://portfolio.example/work/leadflow",
    );
    expect(document.querySelector('meta[property="og:image"]').content).toBe(
      "https://portfolio.example/assets/social/leadflow.png",
    );
    const graph = JSON.parse(
      document.getElementById("page-structured-data").textContent,
    )["@graph"];
    expect(graph.find((item) => item["@type"] === "WebPage").url).toBe(
      "https://portfolio.example/work/leadflow",
    );
    expect(graph.find((item) => item["@type"] === "Person").jobTitle).toBe(
      "Computer Science Student",
    );
  });

  it("keeps preview and error pages out of indexing", () => {
    for (const [route, directive, expected] of [
      ["/", "noindex, nofollow", "noindex, nofollow"],
      ["/missing", "index, follow", "noindex, follow"],
    ]) {
      const document = new JSDOM(
        `<head>${seoHead(route, "https://portfolio.example", directive)}</head>`,
      ).window.document;
      expect(document.querySelector('meta[name="robots"]').content).toBe(
        expected,
      );
    }
  });

  it("uses an explicit canonical origin ahead of the deployment host and rejects non-web URLs", () => {
    expect(
      resolveSiteUrl({
        VITE_SITE_URL: "https://portfolio.example/",
        URL: "https://preview.example",
      }),
    ).toBe("https://portfolio.example");
    expect(() =>
      resolveSiteUrl({ VITE_SITE_URL: "javascript:alert(1)" }),
    ).toThrow("HTTP or HTTPS");
  });
});

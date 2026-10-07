export const defaultSiteUrl = "https://govind-charpe.netlify.app";

export function resolveSiteUrl(env = {}) {
  const url = new URL(env.VITE_SITE_URL || env.URL || defaultSiteUrl);
  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("The portfolio site URL must use HTTP or HTTPS.");
  }
  return url.origin;
}

export function normalizePath(pathname) {
  return pathname.replace(/\/+$/, "") || "/";
}

export const routeMetadata = {
  "/": {
    title: "Govind Charpe — Full-Stack Developer & Open-Source Contributor",
    description:
      "Govind Charpe is a computer science student building full-stack projects and learning backend engineering, with contributions to CNCF Harbor CLI and Sugar Labs Music Blocks.",
    image: "/assets/social/portfolio.png",
    imageAlt:
      "Govind Charpe — full-stack projects and open-source contributions.",
  },
  "/work/gitanalyzer": {
    title: "GitAnalyzer Case Study — Govind Charpe",
    description:
      "Explore how Govind Charpe built GitAnalyzer: repository analysis, explainable commit-quality signals, recommendations, and implementation trade-offs.",
    image: "/assets/social/gitanalyzer.png",
    imageAlt:
      "GitAnalyzer case study with the original repository-analysis dashboard.",
  },
  "/work/leadflow": {
    title: "LeadFlow Case Study — Govind Charpe",
    description:
      "Explore Govind Charpe's LeadFlow project: lead qualification, configurable routing, fallback policies, review boundaries, and workflow implementation.",
    image: "/assets/social/leadflow.png",
    imageAlt:
      "LeadFlow case study with the original qualification and routing workflow.",
  },
  "/open-source": {
    title: "Open-Source Contributions — Govind Charpe",
    description:
      "Inspect Govind Charpe's contributions to CNCF Harbor CLI and Sugar Labs Music Blocks, including pull requests, code changes, reviews, and current statuses.",
    image: "/assets/social/open-source.png",
    imageAlt:
      "Govind Charpe's open-source contributions to Harbor CLI and Music Blocks.",
  },
  "/resume": {
    title: "Résumé — Govind Charpe",
    description:
      "View Govind Charpe's résumé: computer science studies, full-stack projects, open-source contributions, and current engineering focus.",
    image: "/assets/social/portfolio.png",
    imageAlt:
      "Govind Charpe — full-stack projects and open-source contributions.",
  },
};

export const notFoundMetadata = {
  title: "Page Not Found — Govind Charpe",
  description: "The requested portfolio page could not be found.",
  image: "/assets/social/portfolio.png",
  imageAlt: routeMetadata["/"].imageAlt,
};

export function structuredData(pathname, siteUrl) {
  const path = normalizePath(pathname);
  const metadata = routeMetadata[path] || notFoundMetadata;
  const url = `${siteUrl}${path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Govind Charpe",
        url: `${siteUrl}/`,
        jobTitle: "Computer Science Student",
        sameAs: [
          "https://github.com/gcharpe1604",
          "https://www.linkedin.com/in/govind-charpe",
          "https://x.com/g_charpe16",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Govind Charpe",
        author: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": path === "/" ? "ProfilePage" : "WebPage",
        "@id": `${url}#page`,
        url,
        name: metadata.title,
        description: metadata.description,
        isPartOf: { "@id": `${siteUrl}/#website` },
        ...(path === "/"
          ? { mainEntity: { "@id": `${siteUrl}/#person` } }
          : {}),
      },
    ],
  };
}

import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProofCursor } from "./ProofCursor";

const routeMetadata = {
  "/": {
    title: "Govind Charpe — Software Engineer",
    description:
      "Govind Charpe builds software products and contributes reviewed changes to open-source engineering systems.",
  },
  "/work/gitanalyzer": {
    title: "GitAnalyzer Case Study — Govind Charpe",
    description:
      "An evidence-led case study of GitAnalyzer, an explainable developer-feedback product for repository history.",
  },
  "/work/leadflow": {
    title: "LeadFlow Case Study — Govind Charpe",
    description:
      "An inspectable lead qualification and routing system with explicit policy, failure, and review boundaries.",
  },
  "/open-source": {
    title: "Open-Source Contributions — Govind Charpe",
    description:
      "Reviewed contributions to CNCF Harbor CLI and Sugar Labs Music Blocks, with implementation evidence and honest statuses.",
  },
  "/resume": {
    title: "Résumé — Govind Charpe",
    description:
      "Govind Charpe's software engineering résumé, projects, open-source experience, and current technical focus.",
  },
};

function setMetaContent(selector, content) {
  document.querySelector(selector)?.setAttribute("content", content);
}

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    const knownRouteMetadata = routeMetadata[location.pathname];
    const metadata = knownRouteMetadata || {
      title: "Page Not Found — Govind Charpe",
      description: "The requested portfolio page could not be found.",
    };
    const canonicalUrl = `${window.location.origin}${location.pathname}`;
    document.title = metadata.title;
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', metadata.title);
    setMetaContent('meta[name="twitter:description"]', metadata.description);
    const robotsMeta = document.querySelector('meta[name="robots"]');
    robotsMeta?.setAttribute(
      "content",
      knownRouteMetadata
        ? robotsMeta.dataset.defaultContent
        : "noindex, follow",
    );
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonicalUrl);

    if (location.hash) {
      window.requestAnimationFrame(() => {
        document
          .querySelector(location.hash)
          ?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <ProofCursor />
      <div key={location.pathname} className="route-curtain" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <Header />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

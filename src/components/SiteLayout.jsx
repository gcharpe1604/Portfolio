import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LazyMotion, domAnimation, m, MotionConfig } from "motion/react";

import {
  defaultSiteUrl,
  normalizePath,
  routeMetadata,
  notFoundMetadata,
  structuredData,
} from "../data/seo";

function setMetaContent(selector, content) {
  document.querySelector(selector)?.setAttribute("content", content);
}

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    const pathname = normalizePath(location.pathname);
    const knownRouteMetadata = routeMetadata[pathname];
    const metadata = knownRouteMetadata || notFoundMetadata;
    const siteUrl = import.meta.env.VITE_SITE_URL || defaultSiteUrl;
    const canonicalUrl = `${siteUrl}${pathname}`;
    const imageUrl = `${siteUrl}${metadata.image}`;
    document.title = metadata.title;
    setMetaContent('meta[name="description"]', metadata.description);
    setMetaContent('meta[property="og:title"]', metadata.title);
    setMetaContent('meta[property="og:description"]', metadata.description);
    setMetaContent('meta[property="og:url"]', canonicalUrl);
    setMetaContent('meta[name="twitter:title"]', metadata.title);
    setMetaContent('meta[name="twitter:description"]', metadata.description);
    setMetaContent('meta[property="og:image"]', imageUrl);
    setMetaContent('meta[property="og:image:alt"]', metadata.imageAlt);
    setMetaContent('meta[name="twitter:image"]', imageUrl);
    setMetaContent('meta[name="twitter:image:alt"]', metadata.imageAlt);
    const schema = document.getElementById("page-structured-data");
    if (schema)
      schema.textContent = JSON.stringify(structuredData(pathname, siteUrl));
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
      let id = location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* Keep malformed fragments harmless. */
      }
      let frame;
      let attempts = 0;
      const align = () => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
        else if (++attempts < 60) frame = window.requestAnimationFrame(align);
      };
      frame = window.requestAnimationFrame(align);
      return () => window.cancelAnimationFrame(frame);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" tabIndex="-1">
          <m.div
            key={location.pathname}
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </m.div>
        </main>
        <Footer />
      </LazyMotion>
    </MotionConfig>
  );
}

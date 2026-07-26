import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Govind Charpe — Software Engineer",
      "/work/gitanalyzer": "GitAnalyzer Case Study — Govind Charpe",
      "/work/leadflow": "LeadFlow Case Study — Govind Charpe",
      "/open-source": "Open-Source Contributions — Govind Charpe",
      "/resume": "Résumé — Govind Charpe",
    };
    const title = titles[location.pathname] || "Page Not Found — Govind Charpe";
    document.title = title;

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
      <Header />
      <main id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <Footer home={location.pathname === "/"} />
    </>
  );
}

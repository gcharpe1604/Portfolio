import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { links, site } from "../data/site";
import { ExternalLink } from "./ExternalLink";

const navigation = [
  { id: "work", label: "Work", to: "/#work" },
  { id: "skills", label: "Skills", to: "/#skills" },
  { id: "open-source", label: "Open Source", to: "/#open-source" },
  { id: "about", label: "About", to: "/#about" },
  { id: "contact", label: "Contact", to: "/#contact" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "dark",
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#121211" : "#F5F2EB");
    localStorage.setItem("gc-theme", next);
    setTheme(next);
  };

  return (
    <button
      className="icon-button"
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" />
      ) : (
        <Moon aria-hidden="true" />
      )}
    </button>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(
    () => window.location.hash.slice(1) || "hero",
  );
  const menuButtonRef = useRef(null);
  const sheetRef = useRef(null);
  const location = useLocation();
  const isActive = (item) => {
    if (item.id === "work") {
      return (
        location.pathname.startsWith("/work/") ||
        (location.pathname === "/" && activeSection === item.id)
      );
    }
    if (item.id === "open-source") {
      return (
        location.pathname === "/open-source" ||
        (location.pathname === "/" && activeSection === item.id)
      );
    }
    return location.pathname === "/" && activeSection === item.id;
  };

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 48);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return undefined;
    const sectionIds = [
      "hero",
      "work",
      "skills",
      "open-source",
      "principles",
      "about",
      "contact",
    ];
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const marker = window.scrollY + 180;
        let current = "hero";
        sectionIds.forEach((id) => {
          const element = document.getElementById(id);
          const elementTop = element
            ? element.getBoundingClientRect().top + window.scrollY
            : Number.POSITIVE_INFINITY;
          if (elementTop <= marker) current = id;
        });
        setActiveSection(current);
        frame = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const sheet = sheetRef.current;
    const focusable = sheet?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();
    document.body.classList.add("menu-is-open");

    const handleKey = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.classList.remove("menu-is-open");
    };
  }, [menuOpen]);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="Govind Charpe, home">
          <span className="brand-mark">{site.monogram}</span>
          <span>{site.name}</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={isActive(item) ? "nav-link is-active" : "nav-link"}
              aria-current={isActive(item) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="header-resume-link" to={links.resume}>
            View résumé
          </Link>
          <ExternalLink
            className="icon-link"
            href={links.github}
            label="Open Govind Charpe’s GitHub profile in a new tab"
            showIndicator={false}
          >
            <Github aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </ExternalLink>
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="sheet-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMenuOpen(false);
              menuButtonRef.current?.focus();
            }
          }}
        >
          <div
            ref={sheetRef}
            className="mobile-sheet"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="mobile-sheet-header">
              <span className="eyebrow">Navigation</span>
              <button
                className="icon-button"
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                }}
                aria-label="Close navigation menu"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {navigation.map((item, index) => (
                <Link key={item.label} to={item.to}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              ))}
              <Link to={links.resume}>
                <span>06</span>
                View résumé
              </Link>
            </nav>
            <div className="mobile-sheet-meta">
              <p>{site.availability}</p>
              <a href={`mailto:${links.email}`}>{links.email}</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

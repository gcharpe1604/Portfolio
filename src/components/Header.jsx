import { m, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { links, site } from "../data/site";
import { ExternalLink } from "./ExternalLink";
import { QuickNavigation } from "./QuickNavigation";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";

const navigation = [
  { id: "work", label: "Work", to: "/#work" },
  { id: "open-source", label: "Open Source", to: "/#open-source" },
  { id: "lab", label: "Lab", to: "/#lab" },
  { id: "skills", label: "Skills", to: "/#skills" },
  { id: "about", label: "About", to: "/#about" },
  { id: "contact", label: "Contact", to: "/#contact" },
];

function NavigationLinks({ activeId, mobile = false, reducedMotion }) {
  const navRef = useRef(null);
  const linkRefs = useRef({});
  const [indicator, setIndicator] = useState(null);
  const items = mobile
    ? [...navigation, { id: "resume", label: "View résumé", to: links.resume }]
    : navigation;

  useLayoutEffect(() => {
    const nav = navRef.current;
    const link = linkRefs.current[activeId];
    let mounted = true;
    const measure = () => {
      if (!mounted) return;
      const navBox = nav.getBoundingClientRect();
      const linkBox = link?.getBoundingClientRect();
      setIndicator(
        linkBox?.width
          ? {
              x: linkBox.left - navBox.left,
              y: linkBox.top - navBox.top,
              width: linkBox.width,
              height: linkBox.height,
            }
          : null,
      );
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(nav);
    if (link) observer?.observe(link);
    return () => {
      mounted = false;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [activeId]);

  return (
    <nav
      ref={navRef}
      className={mobile ? "pf-mobile-nav" : "pf-desktop-nav"}
      aria-label={mobile ? "Mobile navigation" : "Primary navigation"}
    >
      {indicator && (
        <m.div
          className="pf-nav-indicator"
          aria-hidden="true"
          initial={false}
          animate={indicator}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 350, damping: 32 }
          }
        />
      )}
      {items.map((item) => (
        <Link
          key={item.id}
          ref={(link) => {
            linkRefs.current[item.id] = link;
          }}
          to={item.to}
          className={`nav-link${activeId === item.id ? " is-active" : ""}`}
          aria-current={activeId === item.id ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || "light",
  );

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#191e19" : "#f3efe5");
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
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
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
  const progressRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const returnHome = (event) => {
    if (
      location.pathname !== "/" ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    if (location.search || location.hash) navigate("/");
    window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth",
      });
    });
  };

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
  const activeNavId =
    navigation.find(isActive)?.id ||
    (location.pathname === "/resume" ? "resume" : null);

  useEffect(() => {
    const update = () => {
      // Start after the hero moves 2px beneath the sticky header; keep the
      // capsule until the page returns to the top to avoid boundary flicker.
      setScrolled((current) =>
        current ? window.scrollY > 0 : window.scrollY >= 2,
      );
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? window.scrollY / distance : 0;
      progressRef.current?.style.setProperty(
        "--scroll-progress",
        `${Math.min(1, Math.max(0, progress))}`,
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (location.pathname !== "/") return undefined;
    const sectionIds = [
      "hero",
      "work",
      "open-source",
      "lab",
      "skills",
      "about",
      "contact",
    ];
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const viewportMarker = Math.min(
          340,
          Math.max(180, window.innerHeight * 0.38),
        );
        const marker = window.scrollY + viewportMarker;
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
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
    <header className={`pf-site-header ${scrolled ? "is-scrolled" : ""}`}>
      <span
        ref={progressRef}
        className="site-scroll-progress"
        aria-hidden="true"
      />
      <div className="pf-header-inner">
        <Link
          className="pf-brand"
          to="/"
          aria-label="Govind Charpe, home"
          onClick={returnHome}
        >
          <span className="pf-brand-mark" aria-hidden="true">
            gc<span>.</span>
          </span>
          <span className="pf-brand-name">{site.name}</span>
        </Link>

        <NavigationLinks activeId={activeNavId} reducedMotion={reduceMotion} />

        <div className="pf-header-actions">
          <Link className="pf-header-resume" to={links.resume}>
            Résumé <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
          <ExternalLink
            className="icon-link"
            href={links.github}
            label="Open Govind Charpe’s GitHub profile in a new tab"
            showIndicator={false}
          >
            GitHub
          </ExternalLink>
          <ThemeToggle />
          <QuickNavigation />
          <button
            ref={menuButtonRef}
            className="icon-button mobile-menu-button"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={21} aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          className="pf-sheet-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setMenuOpen(false);
              menuButtonRef.current?.focus();
            }
          }}
        >
          <div
            ref={sheetRef}
            className="pf-mobile-sheet"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <div className="pf-mobile-sheet-header">
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
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <NavigationLinks
              activeId={activeNavId}
              mobile
              reducedMotion={reduceMotion}
            />
            <div className="pf-mobile-sheet-meta">
              <p>{site.availability}</p>
              <a href={`mailto:${links.email}`}>{links.email}</a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

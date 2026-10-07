import { ArrowUpRight, Search, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const destinations = [
  {
    label: "GitAnalyzer",
    group: "Project",
    to: "/work/gitanalyzer",
    keywords: "product commits repository developer tools react",
  },
  {
    label: "LeadFlow",
    group: "Project",
    to: "/work/leadflow",
    keywords: "workflow automation qualification n8n routing",
  },
  {
    label: "Selected projects",
    group: "Homepage",
    to: "/#work",
    keywords: "work build",
  },
  {
    label: "Interface lab",
    group: "Homepage",
    to: "/#lab",
    keywords: "interactive experiment css playground",
  },
  {
    label: "Contribution ledger",
    group: "Page",
    to: "/open-source",
    keywords: "harbor music blocks open source pull requests upstream go",
  },
  {
    label: "The toolkit",
    group: "Homepage",
    to: "/#skills",
    keywords: "skills languages frontend backend technologies",
  },
  {
    label: "About Govind",
    group: "Homepage",
    to: "/#about",
    keywords: "background education learning student current project",
  },
  {
    label: "Résumé",
    group: "Page",
    to: "/resume",
    keywords: "resume cv pdf download",
  },
  {
    label: "Get in touch",
    group: "Homepage",
    to: "/#contact",
    keywords: "contact email internship collaboration",
  },
];

export function QuickNavigation() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const dialog = useRef(null);
  const input = useRef(null);
  const restore = useRef(null);
  const resultRefs = useRef([]);
  const id = useId();
  const navigate = useNavigate();
  const normalized = query.trim().toLowerCase();
  const results = destinations.filter((item) =>
    `${item.label} ${item.group} ${item.keywords}`
      .toLowerCase()
      .includes(normalized),
  );
  const close = useCallback((restoreFocus = true) => {
    dialog.current?.close();
    document.body.classList.remove("command-is-open");
    if (restoreFocus) restore.current?.focus();
  }, []);
  const open = useCallback(() => {
    if (document.querySelector(".pf-mobile-sheet, dialog[open]")) return;
    restore.current = document.activeElement;
    setQuery("");
    setSelected(0);
    dialog.current?.showModal();
    document.body.classList.add("command-is-open");
    input.current?.focus();
  }, []);
  const choose = (item) => {
    if (!item) return;
    close(false);
    navigate(item.to);
    window.requestAnimationFrame(() =>
      document.getElementById("main-content")?.focus({ preventScroll: true }),
    );
  };
  useEffect(() => {
    const shortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) close();
        else open();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => {
      document.removeEventListener("keydown", shortcut);
      document.body.classList.remove("command-is-open");
    };
  }, [open, close]);
  const keyboard = (event) => {
    if (["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      if (results.length) {
        const next =
          (selected + (event.key === "ArrowDown" ? 1 : results.length - 1)) %
          results.length;
        setSelected(next);
        resultRefs.current[next]?.scrollIntoView?.({ block: "nearest" });
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(results[selected]);
    }
  };
  return (
    <>
      <button
        className="icon-button quick-navigation-trigger"
        type="button"
        aria-label="Open quick navigation"
        aria-haspopup="dialog"
        title="Quick navigation · Ctrl/⌘ K"
        onClick={open}
      >
        <Search size={17} aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        className="quick-navigation"
        aria-labelledby={`${id}-title`}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="quick-navigation-panel">
          <header>
            <span className="pf-kicker" id={`${id}-title`}>
              A shortcut to the good stuff
            </span>
            <button
              className="icon-button"
              aria-label="Close quick navigation"
              onClick={() => close()}
            >
              <X size={17} aria-hidden="true" />
            </button>
          </header>
          <div className="quick-search">
            <Search size={20} aria-hidden="true" />
            <input
              ref={input}
              type="text"
              role="combobox"
              aria-label="Search pages and sections"
              aria-expanded="true"
              aria-controls={`${id}-results`}
              aria-activedescendant={
                results[selected] ? `${id}-result-${selected}` : undefined
              }
              aria-autocomplete="list"
              placeholder="Projects, skills, open source…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelected(0);
              }}
              onKeyDown={keyboard}
            />
          </div>
          <div
            className="quick-results"
            id={`${id}-results`}
            role="listbox"
            aria-label="Navigation results"
          >
            {results.map((item, i) => (
              <button
                ref={(el) => {
                  resultRefs.current[i] = el;
                }}
                key={item.to}
                role="option"
                id={`${id}-result-${i}`}
                aria-selected={selected === i}
                tabIndex="-1"
                onPointerMove={() => setSelected(i)}
                onClick={() => choose(item)}
              >
                <span className="quick-result-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.group}</small>
                </span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            ))}
          </div>
          {!results.length && (
            <p className="quick-empty" role="status">
              Nothing matches yet. Try “workflow”, “resume”, or “Harbor”.
            </p>
          )}
          <footer>
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> Explore <kbd>↵</kbd> Go
            </span>
            <span>
              <kbd>esc</kbd> Close
            </span>
          </footer>
        </div>
      </dialog>
    </>
  );
}

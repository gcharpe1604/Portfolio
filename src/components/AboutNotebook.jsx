import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { Link } from "react-router-dom";
import { about } from "../data/site";

const tabs = ["Now", "Approach", "Background"];

function NotebookPage({ selected, reducedMotion }) {
  const isPresent = useIsPresent();
  return (
    <m.div
      className="notebook-panel"
      aria-hidden={!isPresent || undefined}
      style={!isPresent ? { pointerEvents: "none" } : undefined}
      initial={reducedMotion ? false : { opacity: 0, x: 16, rotateY: 3 }}
      animate={{ opacity: 1, x: 0, rotateY: 0 }}
      exit={
        reducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              x: -12,
              rotateY: -3,
              transition: { duration: 0.18, ease: "easeIn" },
            }
      }
      transition={{
        duration: reducedMotion ? 0 : 0.38,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {selected === 0 ? (
        <>
          <span className="pf-kicker">OJT / Under development</span>
          <h3>AI Agent Execution Debugging & Trace Analysis Platform</h3>
          <p>My current project. OpenTrack is on hold.</p>
          <div className="notebook-note">
            <span>Currently learning</span>
            <p>
              Go, backend engineering, databases, Docker, and distributed
              systems.
            </p>
          </div>
        </>
      ) : selected === 1 ? (
        <>
          <span className="pf-kicker">How I approach the work</span>
          <h3>Build. Read. Review. Repeat.</h3>
          <p>{about.paragraphs[1]}</p>
          <Link
            className="pf-link"
            to="/open-source"
            tabIndex={isPresent ? 0 : -1}
          >
            See the review process <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </>
      ) : (
        <>
          <span className="pf-kicker">Education / 2025–2029</span>
          <h3>From interfaces to systems.</h3>
          <p>
            I started with frontend applications and gradually moved toward
            backend systems, APIs, developer tooling, and cloud-native
            engineering.
          </p>
          <div className="pf-education">
            {about.education.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </>
      )}
    </m.div>
  );
}

export function AboutNotebook({ selected, onSelect }) {
  const [indicator, setIndicator] = useState(null);
  const buttons = useRef([]);
  const tabList = useRef(null);
  const reducedMotion = useReducedMotion();
  useLayoutEffect(() => {
    const container = tabList.current;
    const button = buttons.current[selected];
    let mounted = true;
    const measure = () => {
      if (!mounted) return;
      setIndicator({
        x: button.offsetLeft,
        y: button.offsetTop,
        width: button.offsetWidth,
        height: button.offsetHeight,
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;
    observer?.observe(container);
    observer?.observe(button);
    window.addEventListener("resize", measure);
    return () => {
      mounted = false;
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [selected]);
  const keyboard = (event, i) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tabs.length - 1
          : (i + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) %
            tabs.length;
    onSelect(next);
    buttons.current[next]?.focus();
  };
  return (
    <div className="pf-current about-notebook">
      <div className="notebook-header">
        <span className="pf-kicker">Field notes / 00{selected + 1}</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div
        role="tablist"
        aria-label="About Govind"
        className={"notebook-tabs" + (indicator ? " has-indicator" : "")}
        ref={tabList}
      >
        {indicator && (
          <m.div
            className="notebook-tab-indicator"
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
        {tabs.map((tab, i) => (
          <button
            ref={(el) => {
              buttons.current[i] = el;
            }}
            key={tab}
            type="button"
            role="tab"
            id={"notebook-tab-" + i}
            aria-selected={selected === i}
            aria-controls="notebook-panel"
            tabIndex={selected === i ? 0 : -1}
            onClick={() => onSelect(i)}
            onKeyDown={(event) => keyboard(event, i)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div
        className="notebook-page-window"
        id="notebook-panel"
        role="tabpanel"
        aria-labelledby={"notebook-tab-" + selected}
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <NotebookPage
            key={selected}
            selected={selected}
            reducedMotion={reducedMotion}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

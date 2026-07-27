import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projectFeatures } from "../data/home";
import { projects } from "../data/site";
import { ExternalLink } from "./ExternalLink";
import { MediaDialog } from "./MediaDialog";
import { ResponsiveImage } from "./ResponsiveImage";

export function FeatureExplorer() {
  const [activeId, setActiveId] = useState(projectFeatures[0].id);
  const tabsRef = useRef([]);
  const reduceMotion = useReducedMotion();
  const active = projectFeatures.find((feature) => feature.id === activeId);
  const project = projects.gitAnalyzer;

  const selectAdjacent = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = index - 1;
    if (event.key === "ArrowRight") nextIndex = index + 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = projectFeatures.length - 1;
    nextIndex = (nextIndex + projectFeatures.length) % projectFeatures.length;
    const next = projectFeatures[nextIndex];
    setActiveId(next.id);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <article
      className="feature-explorer project-spread project-gitanalyzer"
      aria-labelledby="gitanalyzer-title"
      data-project="gitanalyzer"
    >
      <span className="project-chapter-mark" aria-hidden="true">
        01 / G
      </span>
      <header className="project-editorial-header">
        <div>
          <span className="project-kicker">{project.label}</span>
          <h3 id="gitanalyzer-title">{project.title}</h3>
        </div>
        <p>{project.description}</p>
      </header>

      <div
        className="feature-tabs"
        role="tablist"
        aria-label="GitAnalyzer features"
      >
        {projectFeatures.map((feature, index) => (
          <button
            key={feature.id}
            ref={(element) => {
              tabsRef.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`feature-tab-${feature.id}`}
            aria-selected={activeId === feature.id}
            aria-controls="feature-panel"
            tabIndex={activeId === feature.id ? 0 : -1}
            onClick={() => setActiveId(feature.id)}
            onKeyDown={(event) => selectAdjacent(event, index)}
            data-cursor="Inspect"
          >
            {activeId === feature.id ? (
              <m.span
                className="selection-rail"
                layoutId="feature-selection"
                transition={{
                  type: "spring",
                  stiffness: 460,
                  damping: 36,
                }}
              />
            ) : null}
            <span className="feature-tab-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="feature-tab-label">{feature.label}</span>
          </button>
        ))}
      </div>

      <div
        className="feature-panel"
        id="feature-panel"
        role="tabpanel"
        aria-labelledby={`feature-tab-${active.id}`}
      >
        <div className="feature-visual evidence-frame">
          <div className="evidence-window-bar" aria-hidden="true">
            <span />
            <span />
            <span />
            <p>gitanalyzer-ai.netlify.app/report</p>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={active.id}
              initial={reduceMotion ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <ResponsiveImage
                asset={active.asset}
                sizes="(max-width: 767px) 100vw, 840px"
              />
            </m.div>
          </AnimatePresence>
          <MediaDialog
            asset={active.asset}
            label="Expand evidence"
            caption={`${project.title} — ${active.label}`}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active.id}
            className="feature-reading"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="editorial-insight">{active.claim}</p>
            <dl>
              <div>
                <dt>Implementation decision</dt>
                <dd>{active.decision}</dd>
              </div>
              <div>
                <dt>Outcome or boundary</dt>
                <dd>{active.result}</dd>
              </div>
            </dl>
          </m.div>
        </AnimatePresence>
      </div>

      <footer className="project-actions">
        <p>{project.summary}</p>
        <div>
          <Link className="button button-primary" to={project.links.caseStudy}>
            View case study <ArrowRight aria-hidden="true" />
          </Link>
          <ExternalLink className="text-link" href={project.links.live}>
            Live product
          </ExternalLink>
          <ExternalLink className="text-link" href={project.links.source}>
            Source code
          </ExternalLink>
        </div>
      </footer>
    </article>
  );
}

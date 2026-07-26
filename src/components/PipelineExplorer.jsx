import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { pipelineStages } from "../data/home";
import { projects } from "../data/site";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ExternalLink } from "./ExternalLink";
import { MediaDialog } from "./MediaDialog";
import { ResponsiveImage } from "./ResponsiveImage";

function PipelineEvidence({ stage, compact = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={stage.id}
        className={`pipeline-evidence-content ${compact ? "is-compact" : ""}`}
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pipeline-evidence-copy">
          <span className="project-kicker">Selected stage</span>
          <h4>{stage.label}</h4>
          <dl>
            <div>
              <dt>Input</dt>
              <dd>{stage.input}</dd>
            </div>
            <div>
              <dt>Decision</dt>
              <dd>{stage.decision}</dd>
            </div>
            <div>
              <dt>Output</dt>
              <dd>{stage.output}</dd>
            </div>
            <div className="failure-boundary">
              <dt>Failure boundary</dt>
              <dd>{stage.boundary}</dd>
            </div>
          </dl>
        </div>
        <figure className="pipeline-media evidence-frame">
          <ResponsiveImage
            asset={stage.asset}
            sizes="(max-width: 767px) 100vw, 560px"
          />
          <figcaption>
            <span>Real LeadFlow workflow evidence</span>
            <MediaDialog
              asset={stage.asset}
              label={`Expand ${stage.label} evidence`}
              caption={`LeadFlow — ${stage.label}`}
            />
          </figcaption>
        </figure>
      </m.div>
    </AnimatePresence>
  );
}

export function PipelineExplorer() {
  const [activeId, setActiveId] = useState(pipelineStages[0].id);
  const tabsRef = useRef([]);
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const activeIndex = pipelineStages.findIndex(
    (stage) => stage.id === activeId,
  );
  const active = pipelineStages[activeIndex];
  const project = projects.leadFlow;

  const selectAdjacent = (event, index) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = index - 1;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = index + 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = pipelineStages.length - 1;
    nextIndex = (nextIndex + pipelineStages.length) % pipelineStages.length;
    setActiveId(pipelineStages[nextIndex].id);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <article className="pipeline-explorer" aria-labelledby="leadflow-title">
      <header className="project-editorial-header">
        <div>
          <span className="project-kicker">{project.label}</span>
          <h3 id="leadflow-title">{project.title}</h3>
        </div>
        <p>{project.description}</p>
      </header>

      <div className="pipeline-stage">
        <div
          className="pipeline-track"
          role="tablist"
          aria-label="LeadFlow pipeline stages"
        >
          <span className="pipeline-line" aria-hidden="true">
            <m.span
              key={activeId}
              className="pipeline-beam"
              initial={
                reduceMotion
                  ? false
                  : { scaleX: Math.max(0.02, (activeIndex - 1) / 4) }
              }
              animate={{ scaleX: activeIndex / 4 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          {pipelineStages.map((stage, index) => (
            <div className="pipeline-step-wrap" key={stage.id}>
              <button
                ref={(element) => {
                  tabsRef.current[index] = element;
                }}
                className="pipeline-step"
                type="button"
                role="tab"
                id={`pipeline-tab-${stage.id}`}
                aria-selected={activeId === stage.id}
                aria-controls={
                  isMobile ? `pipeline-panel-${stage.id}` : "pipeline-panel"
                }
                tabIndex={activeId === stage.id ? 0 : -1}
                onClick={() => setActiveId(stage.id)}
                onKeyDown={(event) => selectAdjacent(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{stage.label}</strong>
              </button>
              <div
                className="pipeline-mobile-evidence"
                id={isMobile ? `pipeline-panel-${stage.id}` : undefined}
                role={
                  isMobile && activeId === stage.id ? "tabpanel" : undefined
                }
                aria-labelledby={
                  isMobile && activeId === stage.id
                    ? `pipeline-tab-${stage.id}`
                    : undefined
                }
              >
                {isMobile && activeId === stage.id ? (
                  <PipelineEvidence stage={stage} compact />
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {!isMobile ? (
          <div
            className="pipeline-desktop-evidence"
            id="pipeline-panel"
            role="tabpanel"
            aria-labelledby={`pipeline-tab-${active.id}`}
          >
            <PipelineEvidence stage={active} />
          </div>
        ) : null}
      </div>

      <footer className="project-actions">
        <p>{project.summary}</p>
        <div>
          <Link className="button leadflow-button" to={project.links.caseStudy}>
            Explore the system <ArrowRight aria-hidden="true" />
          </Link>
          <ExternalLink className="text-link" href={project.links.source}>
            Source code
          </ExternalLink>
        </div>
      </footer>
    </article>
  );
}

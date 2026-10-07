import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { ExternalLink } from "../components/ExternalLink";
import { LeadFlowDiagram } from "../components/LeadFlowDiagram";
import { MediaDialog } from "../components/MediaDialog";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { StatusBadge } from "../components/StatusBadge";
import { PointerSurface } from "../components/PointerSurface";
import { caseStudies } from "../data/caseStudies";
import { ArrowUpRight } from "lucide-react";

function CopySectionLink({ id }) {
  const [message, setMessage] = useState("");
  const timer = useRef();
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Copied");
    } catch {
      setMessage(
        "Copy unavailable. Use this section’s link in the page index.",
      );
    }
    timer.current = window.setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <button
        type="button"
        className="copy-section-link"
        onClick={copy}
        aria-label={`Copy link to ${id} section`}
      >
        <span>{message === "Copied" ? "Copied" : "Copy link"}</span>
      </button>
      <span className="sr-only" role="status">
        {message}
      </span>
    </>
  );
}

function Walkthrough({ items }) {
  const [activeId, setActiveId] = useState(items[0].id);
  const tabsRef = useRef([]);
  const active = items.find((item) => item.id === activeId);

  const selectAdjacent = (event, index) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = index - 1;
    if (event.key === "ArrowRight") nextIndex = index + 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;
    nextIndex = (nextIndex + items.length) % items.length;
    setActiveId(items[nextIndex].id);
    tabsRef.current[nextIndex]?.focus();
  };

  return (
    <>
      <div className="desktop-walkthrough">
        <div className="walkthrough-tabs" role="tablist">
          {items.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => {
                tabsRef.current[index] = element;
              }}
              type="button"
              role="tab"
              aria-selected={activeId === item.id}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              tabIndex={activeId === item.id ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => selectAdjacent(event, index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </button>
          ))}
        </div>
        <div
          className="walkthrough-panel"
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          <ResponsiveImage
            asset={active.asset}
            sizes="(max-width: 63.9375rem) 90vw, 47.5rem"
          />
          <div>
            <p>{active.summary}</p>
            <MediaDialog
              asset={active.asset}
              label="Expand screenshot"
              caption={active.label}
            />
          </div>
        </div>
      </div>
      <div className="mobile-walkthrough">
        {items.map((item) => (
          <figure key={item.id}>
            <ResponsiveImage asset={item.asset} sizes="92vw" />
            <figcaption>
              <strong>{item.label}</strong>
              <p>{item.summary}</p>
              <MediaDialog
                asset={item.asset}
                label="Expand screenshot"
                caption={item.label}
              />
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

function SectionContent({ section }) {
  return (
    <>
      {section.body?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      {section.facts ? (
        <dl className="case-facts">
          {section.facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {section.list ? (
        <ul className="case-list">
          {section.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
      {section.walkthrough ? <Walkthrough items={section.walkthrough} /> : null}
      {section.diagram ? (
        <LeadFlowDiagram stages={section.diagram} interactive />
      ) : null}
      {section.media ? (
        <div className="case-media-sequence">
          {section.media.map((item) => (
            <figure key={item.title}>
              <ResponsiveImage
                asset={item.asset}
                sizes="(max-width: 63.9375rem) 92vw, 47.5rem"
              />
              <figcaption>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.caption}</p>
                </div>
                <MediaDialog
                  asset={item.asset}
                  label="Expand evidence"
                  caption={item.caption}
                />
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}
      {section.responsibilities ? (
        <dl className="responsibility-list">
          {section.responsibilities.map(([label, detail]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {section.architecture ? (
        <ArchitectureDiagram architecture={section.architecture} />
      ) : null}
      {section.decisions ? (
        <div className="decision-list">
          {section.decisions.map((decision, index) => (
            <article key={decision.context} className="decision">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>Context</strong>
                <p>{decision.context}</p>
              </div>
              <div>
                <strong>Choice</strong>
                <p>{decision.choice}</p>
              </div>
              <div>
                <strong>Trade-off</strong>
                <p>{decision.tradeoff}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
      {section.actions ? (
        <div className="case-actions">
          {section.actions.map((action) => (
            <ExternalLink
              key={action.href}
              className="button button-primary"
              href={action.href}
            >
              {action.label}
            </ExternalLink>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default function CaseStudyPage() {
  const { projectSlug } = useParams();
  const study = caseStudies[projectSlug];
  const [activeSection, setActiveSection] = useState(
    study?.sections[0]?.id || "",
  );

  useEffect(() => {
    if (!study) return undefined;

    let frameId;
    const updateActiveSection = () => {
      const bottomThreshold = window.innerHeight * 0.01;
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - bottomThreshold;

      if (isAtBottom) {
        setActiveSection(study.sections.at(-1)?.id || "");
        return;
      }

      const readingLine = window.innerHeight * 0.32;
      const currentSection = study.sections.reduce((active, section) => {
        const element = document.getElementById(section.id);
        if (!element || element.getBoundingClientRect().top > readingLine) {
          return active;
        }
        return section.id;
      }, study.sections[0]?.id || "");

      setActiveSection(currentSection);
    };

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);
    updateActiveSection();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [study]);

  if (!study) {
    return (
      <div className="not-found">
        <span className="eyebrow">Unknown case study</span>
        <h1>This project page does not exist.</h1>
        <Link className="button button-primary" to="/">
          Return home
        </Link>
      </div>
    );
  }

  const statusKey = study.status.toLowerCase().includes("demo")
    ? "development"
    : "live";

  return (
    <article
      className={`case-study-page case-${projectSlug}`}
      key={projectSlug}
    >
      <header className="case-hero">
        <span className="case-hero-word" aria-hidden="true">
          {study.title}
        </span>
        <div className="case-hero-topline">
          <Link className="breadcrumb" to="/#work">
            {study.breadcrumb}
          </Link>
          <span>
            Case study / {projectSlug === "gitanalyzer" ? "01" : "02"}
          </span>
        </div>
        <div className="case-hero-grid">
          <div>
            <StatusBadge status={study.status} statusKey={statusKey} />
            <h1>{study.title}</h1>
            <p>{study.outcome}</p>
            <ul className="tag-list">
              {study.stack.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
            <div className="case-actions">
              {Object.entries(study.links)
                .filter(([key]) => key !== "caseStudy")
                .map(([key, href]) => (
                  <ExternalLink
                    key={href}
                    className={
                      key === "live"
                        ? "button button-primary"
                        : "button button-secondary"
                    }
                    href={href}
                  >
                    {key === "live" ? "Open live product" : "View source"}
                  </ExternalLink>
                ))}
            </div>
          </div>
          <PointerSurface className="case-hero-media">
            <ResponsiveImage
              asset={study.heroAsset}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 63.9375rem) 92vw, 45rem"
            />
            <MediaDialog
              asset={study.heroAsset}
              label="Expand hero evidence"
              caption={`${study.title} overview`}
            />
          </PointerSurface>
        </div>
      </header>

      <nav className="mobile-case-index" aria-label="Case study sections">
        {study.sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={activeSection === section.id ? "is-active" : ""}
          >
            {section.title}
          </a>
        ))}
      </nav>

      <div className="case-layout">
        <aside className="case-index">
          <span className="eyebrow">On this page</span>
          <nav aria-label="Case study sections">
            {study.sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={activeSection === section.id ? "is-active" : ""}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="case-reading-column">
          {study.sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={`case-section case-section-${section.id}`}
              data-section={String(index + 1).padStart(2, "0")}
            >
              <header>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
                <CopySectionLink id={section.id} />
              </header>
              <SectionContent section={section} />
            </section>
          ))}
        </div>

        <aside className="case-evidence-rail">
          <span className="eyebrow">System boundary</span>
          <p>
            {projectSlug === "gitanalyzer"
              ? "Deterministic analysis remains separate from optional AI assistance."
              : "A routing plan is not evidence of successful external delivery."}
          </p>
        </aside>
      </div>
      <div className="case-next">
        <div className="pf-wrap">
          <div>
            <span className="pf-kicker">Keep exploring / Next case study</span>
            <h2>
              {projectSlug === "gitanalyzer" ? "LeadFlow" : "GitAnalyzer"}
            </h2>
          </div>
          <Link
            className="pf-button"
            to={`/work/${projectSlug === "gitanalyzer" ? "leadflow" : "gitanalyzer"}`}
          >
            Explore the next project{" "}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

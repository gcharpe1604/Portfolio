import { Check, Copy, ExternalLink as ExternalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArchitectureDiagram } from "../components/ArchitectureDiagram";
import { ExternalLink } from "../components/ExternalLink";
import { LeadFlowDiagram } from "../components/LeadFlowDiagram";
import { MediaDialog } from "../components/MediaDialog";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { StatusBadge } from "../components/StatusBadge";
import { caseStudies } from "../data/caseStudies";

function CopySectionLink({ id }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      className="copy-section-link"
      onClick={copy}
      aria-label={`Copy link to ${id} section`}
    >
      {copied ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <Copy size={16} aria-hidden="true" />
      )}
      <span>{copied ? "Copied" : "Copy link"}</span>
    </button>
  );
}

function Walkthrough({ items }) {
  const [activeId, setActiveId] = useState(items[0].id);
  const active = items.find((item) => item.id === activeId);

  return (
    <>
      <div className="desktop-walkthrough">
        <div className="walkthrough-tabs" role="tablist">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={activeId === item.id}
              aria-controls={`panel-${item.id}`}
              id={`tab-${item.id}`}
              onClick={() => setActiveId(item.id)}
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
            sizes="(max-width: 1023px) 90vw, 760px"
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
                sizes="(max-width: 1023px) 92vw, 760px"
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
    if (!study || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68%", threshold: [0, 0.2, 0.6] },
    );
    study.sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
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
    <article className={`case-study-page case-${projectSlug}`}>
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
          <div className="case-hero-media">
            <ResponsiveImage
              asset={study.heroAsset}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1023px) 92vw, 720px"
            />
            <MediaDialog
              asset={study.heroAsset}
              label="Expand hero evidence"
              caption={`${study.title} overview`}
            />
          </div>
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
          <ExternalIcon aria-hidden="true" />
        </aside>
      </div>
    </article>
  );
}

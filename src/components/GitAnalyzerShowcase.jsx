import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { gitAnalyzerDetails, projects } from "../data/site";
import { ExternalLink } from "./ExternalLink";
import { MediaDialog } from "./MediaDialog";
import { ResponsiveImage } from "./ResponsiveImage";

export function GitAnalyzerShowcase() {
  const [activeId, setActiveId] = useState("scoring");
  const active = gitAnalyzerDetails.find((detail) => detail.id === activeId);
  const project = projects.gitAnalyzer;

  return (
    <article className="featured-project">
      <div className="browser-stage">
        <div className="browser-bar" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>gitanalyzer-ai.netlify.app/report</p>
        </div>
        <div className="featured-image-wrap">
          <ResponsiveImage
            asset={project.image}
            loading="lazy"
            sizes="(max-width: 767px) 100vw, 1180px"
          />
          <div className="image-hotspots" aria-label="GitAnalyzer details">
            {gitAnalyzerDetails.map((detail, index) => (
              <button
                key={detail.id}
                type="button"
                className={`hotspot hotspot-${index + 1} ${
                  activeId === detail.id ? "is-active" : ""
                }`}
                aria-label={`Show ${detail.label}`}
                aria-pressed={activeId === detail.id}
                onClick={() => setActiveId(detail.id)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="image-detail-controls">
          {gitAnalyzerDetails.map((detail, index) => (
            <button
              key={detail.id}
              type="button"
              aria-pressed={activeId === detail.id}
              onClick={() => setActiveId(detail.id)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {detail.label}
            </button>
          ))}
        </div>
        <div className="annotation-panel" aria-live="polite">
          <div>
            <span className="eyebrow">Interface detail</span>
            <h3>{active.label}</h3>
            <p>{active.summary}</p>
          </div>
          <MediaDialog
            asset={active.asset}
            label="View detail"
            caption={active.label}
          />
        </div>
      </div>

      <div className="project-story">
        <div>
          <span className="eyebrow">{project.label}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="action-row">
            <Link
              className="button button-primary"
              to={project.links.caseStudy}
            >
              View case study <ArrowRight aria-hidden="true" />
            </Link>
            <ExternalLink className="text-link" href={project.links.live}>
              Live product
            </ExternalLink>
            <ExternalLink className="text-link" href={project.links.source}>
              Source code
            </ExternalLink>
          </div>
        </div>
        <div className="project-engineering">
          <p>{project.summary}</p>
          <ul>
            {project.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p className="stack-line">{project.stack.join(" · ")}</p>
        </div>
      </div>
    </article>
  );
}

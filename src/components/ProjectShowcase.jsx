import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Braces, Search, X } from "lucide-react";
import { ExternalLink } from "./ExternalLink";
import { ResponsiveImage } from "./ResponsiveImage";
import { ScreenshotLens } from "./ScreenshotLens";
import { assets } from "../data/assets";
import { projects } from "../data/site";

const list = Object.values(projects);
const categories = { gitanalyzer: "Products", leadflow: "Automation" };
const covers = {
  gitanalyzer: assets.gitAnalyzerDashboard,
  leadflow: assets.leadFlowWorkflow,
};
const views = {
  gitanalyzer: [
    { label: "Overview", asset: assets.gitAnalyzerDashboard },
    { label: "Scoring", asset: assets.gitAnalyzerScoring },
    { label: "Recommendations", asset: assets.gitAnalyzerRecommendations },
  ],
  leadflow: [
    { label: "Qualification", asset: assets.leadFlowQualification },
    { label: "Workflow", asset: assets.leadFlowWorkflow },
  ],
};

export function ProjectShowcase() {
  const [selected, setSelected] = useState(list[0].slug);
  const [viewIndex, setViewIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All work");
  const results = list.filter((item) => {
    const content = `${item.title} ${item.description} ${item.summary} ${item.stack.join(" ")} ${categories[item.slug]}`;
    return (
      (category === "All work" || category === categories[item.slug]) &&
      content.toLowerCase().includes(query.trim().toLowerCase())
    );
  });
  const project = results.find((item) => item.slug === selected) || results[0];
  const projectIndex = project ? list.indexOf(project) : -1;
  const projectViews = project ? views[project.slug] : [];
  const view = projectViews[viewIndex] || projectViews[0];
  const selectProject = (item) => {
    setSelected(item.slug);
    setViewIndex(0);
  };
  const cycle = (direction) => {
    const index = results.indexOf(project);
    selectProject(
      results[(index + direction + results.length) % results.length],
    );
  };
  const reset = () => {
    setQuery("");
    setCategory("All work");
    setViewIndex(0);
  };
  return (
    <div className="pf-project-viewer">
      <div className="project-explorer-toolbar">
        <div
          className="project-filters"
          role="group"
          aria-label="Project categories"
        >
          {["All work", "Products", "Automation"].map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => {
                setCategory(item);
                setViewIndex(0);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="project-search">
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            aria-label="Search projects"
            placeholder="Try React or workflows…"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setViewIndex(0);
            }}
          />
          {query && (
            <button
              type="button"
              aria-label="Clear project search"
              onClick={() => {
                setQuery("");
                setViewIndex(0);
              }}
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <div className="project-explorer-meta">
        <span role="status">
          {results.length} {results.length === 1 ? "project" : "projects"} found
        </span>
        <span>Choose a card. Explore what’s inside.</span>
      </div>
      {results.length > 0 ? (
        <>
          <div className="project-gallery" aria-label="Project gallery">
            {results.map((item) => (
              <button
                key={item.slug}
                className={`project-gallery-card project-gallery-${item.slug}`}
                type="button"
                aria-label={`Explore ${item.title}`}
                aria-pressed={project.slug === item.slug}
                aria-controls="pf-project-detail"
                onClick={() => selectProject(item)}
              >
                <div className="project-gallery-image is-screenshot">
                  <ResponsiveImage
                    asset={covers[item.slug]}
                    sizes="(max-width: 600px) 45vw, 50vw"
                  />
                </div>
                <span className="project-gallery-caption">
                  <span>
                    <small>{categories[item.slug]}</small>
                    <strong>{item.title}</strong>
                  </span>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
          <div className="project-detail-heading">
            <span className="pf-kicker">A closer look / {project.title}</span>
            {results.length > 1 && (
              <div className="pf-project-arrows">
                <button
                  type="button"
                  aria-label="Previous project"
                  onClick={() => cycle(-1)}
                >
                  <ArrowRight
                    className="arrow-previous"
                    size={20}
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  aria-label="Next project"
                  onClick={() => cycle(1)}
                >
                  <ArrowRight size={20} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
          <article
            id="pf-project-detail"
            className={`pf-project pf-project-${project.slug}`}
            aria-labelledby="pf-project-title"
          >
            <div className="pf-project-copy">
              <span className="pf-kicker">
                {project.status} / 0{projectIndex + 1}
              </span>
              <h3 id="pf-project-title">{project.title}</h3>
              <p>{project.description}</p>
              <div className="pf-ownership">
                <span>My contribution</span>
                <p>{project.summary}</p>
              </div>
              <ul className="pf-tags" aria-label="Project technologies">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <div className="pf-project-links">
                <Link to={project.links.caseStudy} className="pf-link">
                  Read the case study{" "}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
                <ExternalLink href={project.links.source}>
                  Source code
                </ExternalLink>
                {project.links.live && (
                  <ExternalLink href={project.links.live}>
                    Live site
                  </ExternalLink>
                )}
              </div>
            </div>
            <div className="pf-project-preview">
              <div className="pf-preview-bar">
                <span className="window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span>{project.slug} / actual interface</span>
                <Braces size={15} aria-hidden="true" />
              </div>
              <ScreenshotLens
                key={`${project.slug}-${view.label}`}
                asset={view.asset}
                caption={`${project.title}: ${view.label}`}
              />
              <div
                className="pf-preview-controls"
                aria-label="Project screenshots"
              >
                {projectViews.map((item, i) => (
                  <button
                    key={item.label}
                    type="button"
                    aria-pressed={view === item}
                    onClick={() => setViewIndex(i)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </article>
        </>
      ) : (
        <div className="project-empty">
          <Search size={28} aria-hidden="true" />
          <h3>No project matches that combination.</h3>
          <p>Try “React”, “n8n”, or clear the filters to see everything.</p>
          <button type="button" className="pf-button" onClick={reset}>
            Show all projects <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

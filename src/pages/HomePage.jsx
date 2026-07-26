import { ArrowDown, ArrowRight, Github } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ContactSection } from "../components/ContactSection";
import { ContributionRecord } from "../components/ContributionRecord";
import { ExternalLink } from "../components/ExternalLink";
import { GitAnalyzerShowcase } from "../components/GitAnalyzerShowcase";
import { LeadFlowDiagram } from "../components/LeadFlowDiagram";
import { MediaDialog } from "../components/MediaDialog";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { SectionHeading } from "../components/SectionHeading";
import {
  about,
  capabilities,
  contributions,
  leadFlowStages,
  links,
  openSourceIntro,
  organizations,
  projects,
  site,
  stats,
} from "../data/site";
import { assets } from "../data/assets";

function Hero() {
  return (
    <section className="hero grid-surface" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{site.eyebrow}</span>
          <h1 id="hero-title">{site.headline}</h1>
          <p>{site.introduction}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore my work <ArrowDown aria-hidden="true" />
            </a>
            <ExternalLink
              className="button button-secondary"
              href={links.github}
            >
              <Github aria-hidden="true" />
              View GitHub
            </ExternalLink>
          </div>
          <Link className="resume-link" to={links.resume}>
            Download résumé <ArrowRight aria-hidden="true" />
          </Link>
          <p className="availability">
            <span aria-hidden="true" />
            {site.availability}
          </p>
        </div>

        <div className="proof-stack" aria-label="Engineering proof">
          <a className="proof-card proof-product" href="#work">
            <div className="proof-media">
              <ResponsiveImage
                asset={assets.gitAnalyzerDashboard}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 767px) 90vw, 480px"
              />
            </div>
            <span>GitAnalyzer · Product interface</span>
          </a>
          <a className="proof-card proof-terminal" href="#open-source">
            <div className="proof-media">
              <ResponsiveImage
                asset={assets.harborTerminal}
                sizes="(max-width: 767px) 44vw, 400px"
              />
            </div>
            <span>Harbor CLI · PR #1030 · In review</span>
          </a>
          <a className="proof-card proof-review" href="#open-source">
            <div className="proof-media">
              <ResponsiveImage
                asset={assets.harborReview}
                sizes="(max-width: 767px) 44vw, 360px"
              />
            </div>
            <span>Approved by a Harbor CLI maintainer · Awaiting merge</span>
          </a>
        </div>
      </div>

      <dl className="proof-stats" aria-label="Portfolio proof statistics">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
        <div className="stat-context">
          <dt>CNCF · Sugar Labs</dt>
          <dd>Reviewed upstream work</dd>
        </div>
      </dl>
    </section>
  );
}

function LeadFlowShowcase() {
  const project = projects.leadFlow;
  return (
    <article className="leadflow-showcase">
      <div className="leadflow-visual grid-surface">
        <LeadFlowDiagram stages={leadFlowStages} />
        <figure className="qualification-inset">
          <ResponsiveImage
            asset={assets.leadFlowQualification}
            sizes="(max-width: 767px) 82vw, 340px"
          />
          <figcaption>
            <span>Sample structured qualification output</span>
            <MediaDialog
              asset={assets.leadFlowQualification}
              label="Expand output"
              caption="Sample structured qualification output"
            />
          </figcaption>
        </figure>
      </div>
      <div className="leadflow-story">
        <div>
          <span className="eyebrow">{project.label}</span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="action-row">
            <Link
              className="button button-primary"
              to={project.links.caseStudy}
            >
              Explore the system <ArrowRight aria-hidden="true" />
            </Link>
            <ExternalLink className="text-link" href={project.links.source}>
              Source code
            </ExternalLink>
          </div>
        </div>
        <div className="project-engineering">
          <p>{project.summary}</p>
          <ul>
            {project.highlights.slice(0, 4).map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
          <p className="stack-line">{project.stack.join(" · ")}</p>
        </div>
      </div>
    </article>
  );
}

function HomeOpenSource() {
  const [organization, setOrganization] = useState("harbor");
  const organizationIds = Object.keys(organizations);
  const featuredNumbers =
    organization === "harbor" ? [1030, 849, 930] : [6316, 6602];
  const visible = contributions.filter(
    (item) =>
      item.organization === organization &&
      featuredNumbers.includes(item.number),
  );

  return (
    <section className="open-source-section" id="open-source">
      <div className="open-source-grid">
        <div className="open-source-intro">
          <span className="section-number">02</span>
          <h2>{openSourceIntro.heading}</h2>
          <p>{openSourceIntro.copy}</p>
          <div className="organization-switch" role="tablist">
            {Object.values(organizations).map((org) => (
              <button
                key={org.id}
                id={`organization-tab-${org.id}`}
                type="button"
                role="tab"
                aria-selected={organization === org.id}
                aria-controls="organization-panel"
                onClick={() => setOrganization(org.id)}
                onKeyDown={(event) => {
                  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
                  event.preventDefault();
                  const direction = event.key === "ArrowRight" ? 1 : -1;
                  const currentIndex = organizationIds.indexOf(org.id);
                  const nextId =
                    organizationIds[
                      (currentIndex + direction + organizationIds.length) %
                        organizationIds.length
                    ];
                  setOrganization(nextId);
                  document
                    .getElementById(`organization-tab-${nextId}`)
                    ?.focus();
                }}
              >
                {org.name}
              </button>
            ))}
          </div>
          <p className="organization-description">
            {organizations[organization].intro}
          </p>
          <Link className="text-link" to={`/open-source?org=${organization}`}>
            View all contributions <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div
          className="contribution-stack"
          id="organization-panel"
          role="tabpanel"
          aria-labelledby={`organization-tab-${organization}`}
          aria-live="polite"
        >
          {visible.map((contribution) => (
            <ContributionRecord
              key={`${contribution.organization}-${contribution.number}`}
              contribution={contribution}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="capabilities-section">
      <SectionHeading
        number="03"
        title="Capabilities backed by work"
        copy="Technologies I have used to build products or contribute to existing systems—not a list of everything I have briefly explored."
      />
      <div className="capability-bands">
        {capabilities.map((capability, index) => (
          <article key={capability.title} className="capability-band">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{capability.title}</h3>
            <div>
              <p>{capability.description}</p>
              <ul className="tag-list">
                {capability.technologies.map((technology) => (
                  <li key={technology}>{technology}</li>
                ))}
              </ul>
            </div>
            <div className="evidence-links">
              {capability.evidence.map((evidence) => (
                <Link key={evidence.label} to={evidence.href}>
                  {evidence.label}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section" id="about">
      <SectionHeading number="04" title="About me" />
      <div className="about-grid">
        <div className="about-copy">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <blockquote>
            Building products taught me ownership. Working in existing systems
            taught me judgment.
          </blockquote>
        </div>
        <aside className="about-rail">
          <section>
            <span className="eyebrow">Current focus</span>
            <ul>
              {about.focus.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <span className="eyebrow">Education</span>
            {about.education.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
          <section className="current-build">
            <span className="status-badge status-development">
              <span className="status-dot" aria-hidden="true" />
              Under development
            </span>
            <p>{about.openTrack}</p>
          </section>
        </aside>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="selected-work-section" id="work">
        <SectionHeading
          number="01"
          title="Selected work"
          copy="Products and engineering systems I have taken from an initial problem to a working implementation."
        />
        <GitAnalyzerShowcase />
        <LeadFlowShowcase />
      </section>
      <HomeOpenSource />
      <Capabilities />
      <About />
      <ContactSection />
    </>
  );
}

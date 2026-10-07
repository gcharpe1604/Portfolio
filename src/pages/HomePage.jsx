import { Link } from "react-router-dom";
import { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { ContactSection } from "../components/ContactSection";
import { HeroInspector } from "../components/HeroInspector";
import { HeroDotBackground } from "../components/HeroDotBackground";
import { InterfaceLab } from "../components/InterfaceLab";
import { AboutNotebook } from "../components/AboutNotebook";
import { AboutIdentityCard } from "../components/AboutIdentityCard";
import { ProjectShowcase } from "../components/ProjectShowcase";
import { ExternalLink } from "../components/ExternalLink";
import { SkillsExplorer } from "../components/SkillsExplorer";
import { about, contributions, links } from "../data/site";

export default function HomePage() {
  const reducedMotion = useReducedMotion();
  const [aboutChapter, setAboutChapter] = useState(0);
  return (
    <div className="pf-home">
      <section
        className="pf-hero pf-wrap has-dot-background"
        id="hero"
        aria-labelledby="pf-name"
      >
        <HeroDotBackground />
        <div className="pf-hero-meta">
          <span>
            <i aria-hidden="true" /> Govind Charpe / Software engineering
            student
          </span>
          <span>
            Bengaluru, IN <span aria-hidden="true">↗</span>
          </span>
        </div>
        <div className="pf-hero-body">
          <div className="pf-hero-intro">
            <m.h1
              id="pf-name"
              aria-label="Govind Charpe — Software that invites a closer look."
              initial={reducedMotion ? false : { y: 16 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              Software that
              <br />
              invites a<br />
              <em>closer look.</em>
            </m.h1>
            <p>
              I’m Govind. I build developer tools, work on backend systems, and
              contribute to open source. Curious about the interface. Serious
              about what’s underneath.
            </p>
            <div className="pf-hero-actions">
              <a href="#work" className="pf-button">
                Explore my work <ArrowUpRight size={18} aria-hidden="true" />
              </a>
              <Link to={links.resume} className="pf-link">
                View résumé
              </Link>
            </div>
            <span className="pf-available">
              <i aria-hidden="true" />
              Open to software engineering internships
            </span>
          </div>
          <HeroInspector />
        </div>
        <div className="pf-hero-bottom">
          <a href="#work">
            <ArrowDown size={15} aria-hidden="true" /> A few things I’ve built
          </a>
          <span>Thoughtful interfaces. Inspectable systems.</span>
          <ExternalLink href={links.github} showIndicator>
            Find me on GitHub
          </ExternalLink>
        </div>
      </section>
      <section
        className="pf-work pf-wrap pf-section"
        id="work"
        aria-labelledby="pf-work-heading"
      >
        <header className="pf-section-head">
          <div>
            <span className="pf-kicker">01 / Projects</span>
            <h2 id="pf-work-heading">Selected projects</h2>
          </div>
          <p>
            From a useful idea to a working system. Explore the interface, then
            look under the hood.
          </p>
        </header>
        <ProjectShowcase />
      </section>
      <section
        className="pf-source pf-section"
        id="open-source"
        aria-labelledby="pf-source-heading"
      >
        <div className="pf-wrap">
          <header className="pf-section-head">
            <div>
              <span className="pf-kicker">02 / Open source</span>
              <h2 id="pf-source-heading">
                Better, <em>together.</em>
              </h2>
            </div>
            <Link to="/open-source" className="pf-link">
              All contributions <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </header>
          <div className="pf-source-grid">
            <div className="pf-source-intro">
              <p>
                Open source is where I learn to read unfamiliar code, work
                within a project’s conventions, and improve a change through
                review.
              </p>
              <div className="source-repositories">
                <Link to="/open-source?org=harbor">
                  <span className="repo-monogram">H</span>
                  <div>
                    <strong>Harbor CLI</strong>
                    <span>goharbor / Go</span>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
                <Link to="/open-source?org=musicblocks">
                  <span className="repo-monogram">M</span>
                  <div>
                    <strong>Music Blocks</strong>
                    <span>sugarlabs / JavaScript</span>
                  </div>
                  <ArrowUpRight size={18} />
                </Link>
              </div>
              <span className="pf-kicker">
                Small changes. Real codebases. Shared standards.
              </span>
            </div>
            <div className="pf-pr-list">
              {[849, 855, 6602, 6316].map((number) => {
                const c = contributions.find((item) => item.number === number);
                return (
                  <details key={number}>
                    <summary>
                      <span className="pf-pr-repo">
                        {c.organization === "harbor"
                          ? "Harbor CLI"
                          : "Music Blocks"}{" "}
                        / #{number}
                      </span>
                      <strong>{c.title}</strong>
                      <span className="pf-pr-plus" aria-hidden="true">
                        ↗
                      </span>
                    </summary>
                    <div className="pf-pr-detail">
                      <p>{c.description}</p>
                      <ExternalLink href={c.link}>
                        View pull request
                      </ExternalLink>
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <InterfaceLab />
      <section
        className="pf-section pf-wrap"
        id="skills"
        aria-labelledby="pf-skills-heading"
      >
        <header className="pf-section-head">
          <div>
            <span className="pf-kicker">04 / The toolkit</span>
            <h2 id="pf-skills-heading">
              Tools with <em>context.</em>
            </h2>
          </div>
          <p>Choose a category and a tool to see where it fits into my work.</p>
        </header>
        <SkillsExplorer />
      </section>
      <section
        className="pf-about pf-section"
        id="about"
        aria-labelledby="pf-about-heading"
      >
        <div className="pf-wrap pf-about-grid">
          <AboutIdentityCard selected={aboutChapter} />
          <div className="pf-about-copy">
            <span className="pf-kicker">05 / The person behind the code</span>
            <h2 id="pf-about-heading">
              Always <em>learning.</em>
              <br />
              Always building.
            </h2>
            <p>{about.paragraphs[0]}</p>
            <p>
              I’m currently focusing on backend fundamentals, databases, and
              understanding how software behaves when things go wrong.
            </p>
            <Link to={links.resume} className="pf-link">
              More about my background{" "}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <AboutNotebook selected={aboutChapter} onSelect={setAboutChapter} />
        </div>
      </section>
      <ContactSection />
    </div>
  );
}

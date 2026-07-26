import { ArrowDown, ArrowRight, Github } from "lucide-react";
import { domMax, LazyMotion } from "motion/react";
import { Link } from "react-router-dom";
import { AmbientField } from "../components/AmbientField";
import { ContactSection } from "../components/ContactSection";
import { ContributionLedger } from "../components/ContributionLedger";
import { EngineeringPrinciples } from "../components/EngineeringPrinciples";
import { ExternalLink } from "../components/ExternalLink";
import { FeatureExplorer } from "../components/FeatureExplorer";
import { PipelineExplorer } from "../components/PipelineExplorer";
import { ProofBrowser } from "../components/ProofDesk";
import { SectionHeading } from "../components/SectionHeading";
import { SkillEvidenceMatrix } from "../components/SkillEvidenceMatrix";
import { aboutRail } from "../data/home";
import { about, links, site, stats } from "../data/site";

function Hero() {
  return (
    <section
      className="editorial-hero engineering-grid"
      id="hero"
      aria-labelledby="hero-title"
    >
      <AmbientField />
      <div className="editorial-hero-grid">
        <div className="editorial-hero-copy">
          <span className="eyebrow">{site.eyebrow}</span>
          <h1 id="hero-title">{site.headline}</h1>
          <p>{site.introduction}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">
              Explore selected work <ArrowDown aria-hidden="true" />
            </a>
            <Link className="button button-secondary" to={links.resume}>
              View résumé <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <ExternalLink className="hero-github-link" href={links.github}>
            <Github aria-hidden="true" />
            GitHub profile
          </ExternalLink>
          <p className="availability">
            <span aria-hidden="true" />
            {site.availability}
          </p>
        </div>
        <ProofBrowser />
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

function About() {
  return (
    <section className="home-section about-section editorial-section">
      <SectionHeading
        id="about"
        number="05"
        title="About"
        copy="A product builder learning to make sound engineering decisions inside systems that other people rely on."
      />
      <div className="about-editorial-grid">
        <div className="about-editorial-copy">
          <p>{about.paragraphs[0]}</p>
          <p>{about.paragraphs[1]}</p>
          <blockquote>
            Building products taught me ownership. Working in existing systems
            taught me judgment.
          </blockquote>
          <p>{about.paragraphs[2]}</p>
        </div>

        <aside className="about-status-rail" aria-label="Current direction">
          <dl>
            {aboutRail.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
          <section>
            <span className="project-kicker">Education</span>
            {about.education.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </section>
          <section className="about-open-track">
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
    <LazyMotion features={domMax} strict>
      <Hero />

      <section className="home-section selected-work-section">
        <SectionHeading
          id="work"
          number="01"
          title="Selected work"
          copy="Two different engineering systems: one product for understanding repository history, one workflow for making automated decisions inspectable."
        />
        <FeatureExplorer />
        <PipelineExplorer />
      </section>

      <section className="home-section skills-section">
        <SectionHeading
          id="skills"
          number="02"
          title="Skills, with evidence"
          copy="A scannable inventory of tools I have actually used, with context that distinguishes shipped work from growing proficiency."
        />
        <SkillEvidenceMatrix />
      </section>

      <section className="home-section open-source-section">
        <SectionHeading
          id="open-source"
          number="03"
          title="Open-source validation"
          copy="Representative changes from Harbor CLI and Music Blocks. Status, implementation evidence, and review context stay tied to the underlying pull requests."
        />
        <ContributionLedger />
      </section>

      <section className="home-section principles-section">
        <SectionHeading
          id="principles"
          number="04"
          title="How I engineer"
          copy="Three principles shaped by product work, failure paths, and maintainer review."
        />
        <EngineeringPrinciples />
      </section>

      <About />
      <ContactSection />
    </LazyMotion>
  );
}

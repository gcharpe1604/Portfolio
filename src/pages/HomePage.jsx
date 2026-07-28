import { ArrowDown, ArrowRight, Github } from "lucide-react";
import { domMax, LazyMotion, m, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import { AmbientField } from "../components/AmbientField";
import { ContactSection } from "../components/ContactSection";
import { ContributionLedger } from "../components/ContributionLedger";
import { ExternalLink } from "../components/ExternalLink";
import { FeatureExplorer } from "../components/FeatureExplorer";
import { PipelineExplorer } from "../components/PipelineExplorer";
import { ProofBrowser } from "../components/ProofDesk";
import { SectionHeading } from "../components/SectionHeading";
import { SkillEvidenceMatrix } from "../components/SkillEvidenceMatrix";
import { aboutRail } from "../data/home";
import { about, links, site, stats } from "../data/site";

function StorySection({ children, className }) {
  const reduceMotion = useReducedMotion();

  return (
    <m.section
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 42 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.section>
  );
}

function Hero() {
  return (
    <section
      className="editorial-hero working-proof-hero"
      id="hero"
      aria-labelledby="hero-title"
    >
      <AmbientField />
      <div className="hero-edition-line" aria-hidden="true">
        <span>Working proof</span>
        <span>Issue 01 / 2026</span>
        <span>Bengaluru → anywhere</span>
      </div>
      <div className="editorial-hero-grid">
        <div className="editorial-hero-copy">
          <span className="eyebrow">{site.eyebrow}</span>
          <h1 id="hero-title" aria-label={site.headline}>
            <span aria-hidden="true">I build software </span>
            <span className="hero-title-serif" aria-hidden="true">
              products
            </span>
            <span aria-hidden="true"> and contribute to </span>
            <span className="hero-title-underline" aria-hidden="true">
              real open-source systems.
            </span>
          </h1>
          <p className="hero-introduction">{site.introduction}</p>
          <div className="hero-actions">
            <a
              className="button button-primary"
              href="#work"
              data-cursor="Explore"
            >
              Explore selected work <ArrowDown aria-hidden="true" />
            </a>
            <Link
              className="button button-secondary"
              to={links.resume}
              data-cursor="Read"
            >
              View résumé <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="hero-availability-row">
            <p className="availability">
              <span aria-hidden="true" />
              {site.availability}
            </p>
            <ExternalLink className="hero-github-link" href={links.github}>
              <Github aria-hidden="true" />
              View GitHub
            </ExternalLink>
          </div>
        </div>
        <div className="hero-proof-column">
          <p className="hero-proof-intro">
            <span>Claim</span>
            The work is the interface. The evidence is one interaction away.
          </p>
          <ProofBrowser />
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
          <dt>Product · System · Review</dt>
          <dd>Three kinds of working proof</dd>
        </div>
      </dl>
    </section>
  );
}

function About() {
  return (
    <StorySection className="home-section about-section editorial-section chapter-about">
      <SectionHeading
        id="about"
        number="04"
        title="About"
        copy="A product builder making sound engineering decisions in systems people rely on."
      />
      <div className="about-editorial-grid">
        <div className="about-editorial-copy">
          <p>{about.paragraphs[0]}</p>
          <p>{about.paragraphs[1]}</p>
          <blockquote>
            “Building products taught me ownership. Working in existing systems
            taught me judgment.”
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
    </StorySection>
  );
}

export default function HomePage() {
  return (
    <LazyMotion features={domMax} strict>
      <Hero />

      <StorySection className="home-section selected-work-section chapter-work">
        <SectionHeading
          id="work"
          number="01"
          title="Selected work"
          copy="Two different engineering systems: one product for understanding repository history, one workflow for making automated decisions inspectable."
        />
        <FeatureExplorer />
        <PipelineExplorer />
      </StorySection>

      <StorySection className="home-section skills-section chapter-skills">
        <SectionHeading
          id="skills"
          number="02"
          title="Skills"
          subtitle="With evidence"
          copy="A scannable inventory of tools I have actually used, with context that distinguishes shipped work from growing proficiency."
        />
        <SkillEvidenceMatrix />
      </StorySection>

      <StorySection className="home-section open-source-section chapter-open-source">
        <SectionHeading
          id="open-source"
          number="03"
          title="Open-source"
          subtitle="Validation"
          copy="Representative changes from Harbor CLI and Music Blocks. Status, implementation evidence, and review context stay tied to the underlying pull requests."
        />
        <ContributionLedger />
      </StorySection>

      <About />
      <ContactSection />
    </LazyMotion>
  );
}

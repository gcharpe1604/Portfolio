import { ArrowUpRight, Download } from "lucide-react";
import { about } from "../data/site";

export default function ResumePage() {
  return (
    <section className="pf-resume pf-wrap">
      <header>
        <span className="pf-kicker">Background / Résumé</span>
        <h1>
          Govind
          <br />
          <em>Charpe.</em>
        </h1>
        <p>Projects, open-source contributions, and education in one place.</p>
        <div>
          <a
            className="pf-button"
            href="/resume.pdf"
            download="Govind-Charpe-Resume.pdf"
          >
            Download PDF <Download size={16} aria-hidden="true" />
          </a>
          <a
            className="pf-link"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open PDF <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <section className="resume-notes" aria-label="Background at a glance">
          <div>
            <h2>Education</h2>
            {about.education.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div>
            <h2>Selected work</h2>
            <p>GitAnalyzer · LeadFlow</p>
            <p>Open-source contributions to Harbor CLI and Music Blocks.</p>
          </div>
          <div>
            <h2>Currently exploring</h2>
            <p>Backend fundamentals, databases, and AI agent debugging.</p>
          </div>
        </section>
      </header>
      <figure className="resume-document">
        <div>
          <span>GOVIND CHARPE / RÉSUMÉ</span>
          <span>PDF DOCUMENT ↗</span>
        </div>
        <img
          src="/resume-preview.png"
          alt="Preview of Govind Charpe’s résumé"
          width="1191"
          height="1684"
        />
        <figcaption>
          Prefer the original document?{" "}
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            Open the PDF.
          </a>
        </figcaption>
      </figure>
    </section>
  );
}

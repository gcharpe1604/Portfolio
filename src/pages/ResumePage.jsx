import { Download } from "lucide-react";

export default function ResumePage() {
  return (
    <div className="resume-page">
      <header>
        <span className="resume-page-word" aria-hidden="true">
          CV
        </span>
        <span className="eyebrow">Résumé</span>
        <h1>Govind Charpe</h1>
        <p>
          A one-page résumé covering projects, open-source experience, and
          current engineering focus.
        </p>
        <a
          className="button button-primary"
          href="/resume.pdf"
          download="Govind-Charpe-Resume.pdf"
        >
          <Download aria-hidden="true" />
          Download PDF
        </a>
      </header>
      <section className="resume-viewer" aria-label="Résumé PDF viewer">
        <iframe src="/resume.pdf#view=FitH" title="Govind Charpe résumé" />
        <p>
          If the PDF viewer is unavailable,{" "}
          <a href="/resume.pdf" target="_blank" rel="noreferrer">
            open the résumé in a new tab
          </a>
          .
        </p>
      </section>
    </div>
  );
}

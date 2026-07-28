import { Download, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ResumePage() {
  const viewerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement === viewerRef.current);
    };
    document.addEventListener("fullscreenchange", updateFullscreenState);
    return () =>
      document.removeEventListener("fullscreenchange", updateFullscreenState);
  }, []);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (viewerRef.current?.requestFullscreen) {
      await viewerRef.current.requestFullscreen();
      return;
    }

    window.open("/resume.pdf", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="resume-page">
      <div className="resume-layout">
        <header>
          <span className="resume-page-word" aria-hidden="true">
            CV
          </span>
          <span className="eyebrow">Résumé</span>
          <h1 aria-label="Govind Charpe">
            <span aria-hidden="true">Govind</span>
            <span aria-hidden="true">Charpe</span>
          </h1>
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

        <section
          ref={viewerRef}
          className="resume-viewer"
          aria-label="Résumé PDF viewer"
        >
          <div className="resume-viewer-toolbar">
            <span>Résumé preview</span>
            <button type="button" onClick={toggleFullscreen}>
              {isFullscreen ? (
                <Minimize2 aria-hidden="true" />
              ) : (
                <Maximize2 aria-hidden="true" />
              )}
              {isFullscreen ? "Exit full screen" : "Full screen"}
            </button>
          </div>
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
    </div>
  );
}

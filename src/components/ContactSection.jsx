import { Check, Copy, Github, Linkedin, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { links, site } from "../data/site";
import { ExternalLink } from "./ExternalLink";

export function ContactSection() {
  const [message, setMessage] = useState("");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setMessage("Email copied to clipboard.");
    } catch {
      setMessage(`Copy unavailable. Email: ${links.email}`);
    }
    window.setTimeout(() => setMessage(""), 3000);
  };

  return (
    <section className="contact-section" data-section-tone="contact">
      <div className="contact-grid" id="contact">
        <div>
          <span className="eyebrow">Available for the right work</span>
          <h2>Useful software deserves careful engineering.</h2>
          <span className="contact-asterisk" aria-hidden="true">
            ✦
          </span>
        </div>
        <div>
          <p className="contact-copy">
            I’m currently open to software engineering internships and
            open-source collaborations, particularly around backend systems,
            developer infrastructure and cloud-native tooling.
          </p>
          <p className="location">{site.location}</p>
          <a className="contact-email" href={`mailto:${links.email}`}>
            {links.email}
          </a>
          <div className="contact-actions">
            <button
              className="button button-primary"
              type="button"
              onClick={copyEmail}
            >
              {message.startsWith("Email copied") ? (
                <Check aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              Copy email
            </button>
            <a
              className="button button-secondary"
              href={`mailto:${links.email}`}
            >
              <Mail aria-hidden="true" />
              Open mail client
            </a>
            <ExternalLink href={links.linkedIn} className="icon-text-link">
              <Linkedin aria-hidden="true" />
              LinkedIn
            </ExternalLink>
            <ExternalLink href={links.github} className="icon-text-link">
              <Github aria-hidden="true" />
              GitHub
            </ExternalLink>
            <Link className="text-link" to={links.resume}>
              Résumé
            </Link>
          </div>
          <p
            className={`copy-status ${message ? "is-visible" : ""}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}

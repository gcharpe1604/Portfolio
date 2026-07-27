import {
  ArrowUpRight,
  Check,
  Copy,
  Github,
  Linkedin,
  Mail,
  Twitter,
} from "lucide-react";
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
            <ExternalLink href={links.linkedIn} className="contact-action-link">
              <Linkedin aria-hidden="true" />
              LinkedIn
            </ExternalLink>
            <ExternalLink href={links.github} className="contact-action-link">
              <Github aria-hidden="true" />
              GitHub
            </ExternalLink>
            <ExternalLink href={links.twitter} className="contact-action-link">
              <Twitter aria-hidden="true" />
              Twitter
            </ExternalLink>
            <Link
              className="contact-action-link contact-resume-link"
              to={links.resume}
            >
              <span>Résumé</span>
              <ArrowUpRight aria-hidden="true" />
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

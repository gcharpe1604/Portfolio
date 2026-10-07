import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "./ExternalLink";
import { links } from "../data/site";
import { ArrowUpRight, Check, Copy } from "lucide-react";

export function ContactSection() {
  const [message, setMessage] = useState("");
  const timer = useRef();
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copyEmail = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(links.email);
      setMessage("Email copied to clipboard.");
    } catch {
      setMessage(`Copy unavailable. Email: ${links.email}`);
    }
    timer.current = window.setTimeout(() => setMessage(""), 3000);
  };
  return (
    <section
      className="pf-contact pf-section"
      id="contact"
      aria-labelledby="pf-contact-heading"
    >
      <div className="pf-wrap">
        <div className="pf-contact-top">
          <span className="pf-kicker">06 / Let’s make something useful</span>
          <span>Internships & collaboration</span>
        </div>
        <a className="pf-contact-title" href={`mailto:${links.email}`}>
          <h2 id="pf-contact-heading">
            Have something
            <br />
            <em>in mind?</em>
          </h2>
          <span className="contact-arrow">
            <ArrowUpRight aria-hidden="true" />
          </span>
        </a>
        <div className="pf-contact-bottom">
          <div className="pf-email-row">
            <a href={`mailto:${links.email}`}>{links.email}</a>
            <button type="button" aria-label="Copy email" onClick={copyEmail}>
              {message.startsWith("Email copied") ? (
                <Check size={17} aria-hidden="true" />
              ) : (
                <Copy size={17} aria-hidden="true" />
              )}{" "}
              {message.startsWith("Email copied") ? "Copied" : "Copy email"}
            </button>
            <p
              className="copy-status"
              role="status"
              aria-label="Email copy result"
            >
              {message}
            </p>
          </div>
          <nav aria-label="Contact links">
            <ExternalLink href={links.github}>GitHub</ExternalLink>
            <ExternalLink href={links.linkedIn}>LinkedIn</ExternalLink>
            <ExternalLink href={links.twitter}>X / Twitter</ExternalLink>
          </nav>
        </div>
      </div>
    </section>
  );
}

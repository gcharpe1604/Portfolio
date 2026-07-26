import { Link } from "react-router-dom";
import { links } from "../data/site";
import { ExternalLink } from "./ExternalLink";

export function Footer({ home = false }) {
  return (
    <footer className={`site-footer ${home ? "site-footer-home" : ""}`}>
      <div className="footer-inner">
        <div>
          <p>Designed and built by Govind Charpe.</p>
          <p>Built with React and Vite. Source available on GitHub.</p>
        </div>
        <nav aria-label="Footer navigation">
          <ExternalLink href={links.github}>GitHub</ExternalLink>
          <ExternalLink href={links.linkedIn}>LinkedIn</ExternalLink>
          <Link to={links.resume}>Résumé</Link>
        </nav>
        <p>© {new Date().getFullYear()} Govind Charpe</p>
      </div>
    </footer>
  );
}

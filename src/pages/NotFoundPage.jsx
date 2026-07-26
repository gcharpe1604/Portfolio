import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="eyebrow">404 · Route not found</span>
      <h1>This path is outside the system.</h1>
      <p>
        The page may have moved, or the link may be incomplete. The selected
        work and contribution log are available from the homepage.
      </p>
      <Link className="button button-primary" to="/">
        <ArrowLeft aria-hidden="true" />
        Return home
      </Link>
    </div>
  );
}

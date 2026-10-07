import { Link } from "react-router-dom";
export function Footer() {
  return (
    <footer className="pf-footer">
      <div className="pf-wrap">
        <Link to="/" aria-label="Govind Charpe, home">
          Govind Charpe
        </Link>
        <p>Software engineering student</p>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

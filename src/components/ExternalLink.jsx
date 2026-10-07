import { ArrowUpRight } from "lucide-react";

export function ExternalLink({
  href,
  children,
  className = "",
  label,
  showIndicator = false,
  ...props
}) {
  return (
    <a
      className={`external-link ${className}`.trim()}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      {...props}
    >
      <span>{children}</span>
      {showIndicator ? (
        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
      ) : null}
    </a>
  );
}

export function StatusBadge({ status, statusKey }) {
  return (
    <span className={`status-badge status-${statusKey}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

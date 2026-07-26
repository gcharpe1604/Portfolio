import { useState } from "react";

export function ArchitectureDiagram({ architecture }) {
  const [activeId, setActiveId] = useState(architecture.nodes[0].id);
  const active = architecture.nodes.find((node) => node.id === activeId);

  return (
    <div className="architecture-panel">
      <div
        className="architecture-nodes"
        role="list"
        aria-label={architecture.label}
      >
        {architecture.nodes.map((node, index) => (
          <button
            key={node.id}
            type="button"
            role="listitem"
            className={`architecture-node ${
              activeId === node.id ? "is-active" : ""
            } ${node.optional ? "is-optional" : ""}`}
            aria-pressed={activeId === node.id}
            onClick={() => setActiveId(node.id)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {node.label}
            {node.optional ? <em>Optional</em> : null}
          </button>
        ))}
      </div>
      <p className="architecture-detail" aria-live="polite">
        <strong>{active.label}</strong>
        {active.detail}
      </p>
    </div>
  );
}

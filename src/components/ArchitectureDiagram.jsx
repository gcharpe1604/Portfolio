import { useState } from "react";

export function ArchitectureDiagram({ architecture }) {
  const [activeId, setActiveId] = useState(architecture.nodes[0].id);
  const active = architecture.nodes.find((node) => node.id === activeId);
  const activeIndex = architecture.nodes.findIndex(
    (node) => node.id === activeId,
  );

  return (
    <div
      className="architecture-panel"
      style={{
        "--architecture-progress":
          architecture.nodes.length > 1
            ? activeIndex / (architecture.nodes.length - 1)
            : 0,
      }}
    >
      <ol className="architecture-nodes" aria-label={architecture.label}>
        {architecture.nodes.map((node, index) => (
          <li key={node.id}>
            <button
              type="button"
              className={`architecture-node ${
                activeId === node.id ? "is-active" : ""
              } ${node.optional ? "is-optional" : ""}`}
              aria-pressed={activeId === node.id}
              onClick={() => setActiveId(node.id)}
              data-cursor="Trace"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {node.label}
              {node.optional ? <em>Optional</em> : null}
            </button>
          </li>
        ))}
      </ol>
      <div className="architecture-route" aria-hidden="true">
        <span />
      </div>
      <div className="architecture-detail" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, "0")}</span>
        <p>
          <strong>{active.label}</strong>
          {active.detail}
        </p>
      </div>
    </div>
  );
}

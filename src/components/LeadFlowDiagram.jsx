import { ArrowDown, ArrowRight } from "lucide-react";
import { useState } from "react";

export function LeadFlowDiagram({ stages, interactive = false }) {
  const [activeId, setActiveId] = useState(stages[0].id);
  const active = stages.find((stage) => stage.id === activeId);

  return (
    <div className="pipeline-diagram">
      <ol
        className={`pipeline ${interactive ? "pipeline-interactive" : ""}`}
        aria-label="LeadFlow stages from intake through dispatch"
      >
        {stages.map((stage, index) => {
          const selected = activeId === stage.id;
          return (
            <li key={stage.id} className={selected ? "is-active" : ""}>
              {interactive ? (
                <button
                  className="pipeline-node"
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setActiveId(stage.id)}
                  data-cursor="Trace"
                >
                  <span className="pipeline-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{stage.label}</strong>
                  <span>{stage.detail}</span>
                </button>
              ) : (
                <div className="pipeline-node">
                  <span className="pipeline-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <strong>{stage.label}</strong>
                  <span>{stage.detail}</span>
                </div>
              )}
              {index < stages.length - 1 ? (
                <>
                  <ArrowRight
                    className="pipeline-arrow pipeline-arrow-horizontal"
                    aria-hidden="true"
                  />
                  <ArrowDown
                    className="pipeline-arrow pipeline-arrow-vertical"
                    aria-hidden="true"
                  />
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
      {interactive ? (
        <p className="pipeline-diagram-detail" aria-live="polite">
          <span>Selected stage</span>
          <strong>{active.label}</strong>
          {active.detail}
        </p>
      ) : null}
    </div>
  );
}

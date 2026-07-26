import { ArrowDown, ArrowRight } from "lucide-react";

export function LeadFlowDiagram({ stages, interactive = false }) {
  return (
    <ol
      className={`pipeline ${interactive ? "pipeline-interactive" : ""}`}
      aria-label="LeadFlow stages from intake through dispatch"
    >
      {stages.map((stage, index) => (
        <li key={stage.id}>
          <div className="pipeline-node">
            <span className="pipeline-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <strong>{stage.label}</strong>
            <span>{stage.detail}</span>
          </div>
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
      ))}
    </ol>
  );
}

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { proofRecords } from "../data/home";
import { ResponsiveImage } from "./ResponsiveImage";

const lensPositions = {
  product: "24%",
  terminal: "50%",
  review: "76%",
};

export function ProofLens() {
  const [activeId, setActiveId] = useState(proofRecords[0].id);
  const controlsRef = useRef([]);
  const reduceMotion = useReducedMotion();
  const active = proofRecords.find((record) => record.id === activeId);

  const selectAdjacent = (event, index) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(event.key)
    ) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = index - 1;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = index + 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = proofRecords.length - 1;
    nextIndex = (nextIndex + proofRecords.length) % proofRecords.length;
    setActiveId(proofRecords[nextIndex].id);
    controlsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="proof-lens">
      <div className="proof-lens-shell">
        <div className="proof-lens-bar" aria-hidden="true">
          <span>Evidence instrument</span>
          <span>GC / 01</span>
          <span className="proof-lens-live">
            <i />
            Live proof
          </span>
        </div>

        <div className="proof-lens-body">
          <div
            className="proof-lens-controls"
            aria-label="Selectable engineering proof"
          >
            {proofRecords.map((record, index) => {
              const selected = activeId === record.id;

              return (
                <button
                  key={record.id}
                  ref={(element) => {
                    controlsRef.current[index] = element;
                  }}
                  type="button"
                  aria-pressed={selected}
                  aria-label={`Select ${record.title} proof`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActiveId(record.id)}
                  onFocus={() => setActiveId(record.id)}
                  onKeyDown={(event) => selectAdjacent(event, index)}
                >
                  {selected ? (
                    <m.span
                      className="proof-lens-selection"
                      layoutId="proof-lens-selection"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
                    />
                  ) : null}
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{record.label}</strong>
                  <small>{record.title}</small>
                </button>
              );
            })}
          </div>

          <div
            className="proof-lens-stage"
            style={{ "--lens-position": lensPositions[active.id] }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={active.id}
                className={`proof-lens-visual proof-lens-visual-${active.id}`}
                initial={reduceMotion ? false : { opacity: 0, scale: 1.018 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.992 }
                }
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <ResponsiveImage
                  asset={active.asset}
                  loading={active.id === "product" ? "eager" : "lazy"}
                  fetchPriority={active.id === "product" ? "high" : undefined}
                  sizes="(max-width: 767px) 100vw, 520px"
                />
              </m.div>
            </AnimatePresence>

            <span className="proof-lens-grid" aria-hidden="true" />
            <span className="proof-lens-scan" aria-hidden="true">
              <i />
            </span>
            <span className="proof-lens-coordinate" aria-hidden="true">
              {active.label} /{" "}
              {String(proofRecords.indexOf(active) + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="proof-lens-caption" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active.id}
            className="proof-lens-reading"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span>Selected proof</span>
            <p>{active.claim}</p>
            <dl>
              <div>
                <dt>Artifact</dt>
                <dd>{active.artifact}</dd>
              </div>
              <div>
                <dt>Validation</dt>
                <dd>{active.validation}</dd>
              </div>
            </dl>
          </m.div>
        </AnimatePresence>
        <Link to={active.href}>
          Inspect evidence
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}

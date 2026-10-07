import {
  ArrowRight,
  Check,
  Copy,
  Pause,
  Play,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { pipelineStages } from "../data/home";
import { AnimatedBeam } from "./AnimatedBeam";
import { PointerSurface } from "./PointerSurface";

const colors = [
  { name: "Coral", value: "#f16b50" },
  { name: "Gold", value: "#e3bb46" },
  { name: "Sage", value: "#b7cb8b" },
];
const stageLabels = ["Intake", "Normalize", "Qualify", "Review", "Dispatch"];

export function InterfaceLab() {
  const [stageIndex, setStageIndex] = useState(0);
  const [accent, setAccent] = useState(colors[0]);
  const [radius, setRadius] = useState(20);
  const [playing, setPlaying] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [message, setMessage] = useState("");
  const [running, setRunning] = useState(false);
  const [stepDuration, setStepDuration] = useState(3);
  const [documentVisible, setDocumentVisible] = useState(
    () => !document.hidden,
  );
  const track = useRef(null);
  const nodes = useRef(pipelineStages.map(() => ({ current: null })));
  const buttons = useRef([]);
  const timer = useRef();
  const reducedMotion = useReducedMotion();
  const visible = useInView(track, { margin: "100px" });
  const active = pipelineStages[stageIndex];
  const advancing =
    running &&
    playing &&
    visible &&
    documentVisible &&
    !showCode &&
    !reducedMotion;
  const code = `.lab-workbench {\n  --lab-accent: ${accent.value};\n  --lab-radius: ${radius}px;\n  --lab-duration: ${stepDuration}s;\n}\n\n.lab-stage-detail {\n  border-radius: var(--lab-radius);\n}\n\n.lab-track [aria-selected="true"] > span {\n  background: var(--lab-accent);\n  color: #141814;\n}\n\n.lab-track button > span {\n  border-radius: calc(var(--lab-radius) * .6);\n}\n\n.lab-track-progress {\n  background: var(--lab-accent);\n  transition: width calc(var(--lab-duration) * .18) cubic-bezier(.22, 1, .36, 1);\n}`;
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  useEffect(() => {
    if (!advancing) return undefined;
    const next = window.setTimeout(() => {
      if (stageIndex === pipelineStages.length - 1) setRunning(false);
      else setStageIndex(stageIndex + 1);
    }, stepDuration * 1000);
    return () => window.clearTimeout(next);
  }, [advancing, stageIndex, stepDuration]);
  const selectStage = (next) => {
    setRunning(false);
    setStageIndex(next);
  };
  const resetLab = () => {
    window.clearTimeout(timer.current);
    setMessage("");
    setRunning(false);
    setPlaying(true);
    setStageIndex(0);
    setAccent(colors[0]);
    setRadius(20);
    setStepDuration(3);
    setShowCode(false);
  };
  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setMessage("CSS copied.");
    } catch {
      setMessage("Copy unavailable. Select the CSS to copy it manually.");
    }
    timer.current = window.setTimeout(() => setMessage(""), 3000);
  };
  const keyboard = (event, i) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 4
          : (i + (event.key === "ArrowRight" ? 1 : 4)) % 5;
    selectStage(next);
    buttons.current[next]?.focus();
  };
  return (
    <section
      className="pf-lab pf-section"
      id="lab"
      aria-labelledby="lab-heading"
    >
      <div className="pf-wrap">
        <header className="pf-section-head">
          <div>
            <span className="pf-kicker">03 / A little frontend curiosity</span>
            <h2 id="lab-heading">
              Go on.
              <br />
              <em>Play with it.</em>
            </h2>
          </div>
          <p>
            An interface should invite interaction. Trace a real LeadFlow stage,
            change the styling, and inspect the CSS.
          </p>
        </header>
        <PointerSurface
          className="lab-workbench"
          style={{
            "--lab-accent": accent.value,
            "--lab-radius": `${radius}px`,
            "--lab-duration": `${stepDuration}s`,
          }}
        >
          <div className="lab-toolbar">
            <span>
              <SlidersHorizontal size={17} aria-hidden="true" /> Interface lab /
              001
            </span>
            <div className="lab-view-switch">
              <m.span
                className="lab-view-indicator"
                aria-hidden="true"
                initial={false}
                animate={{ x: showCode ? "100%" : "0%" }}
                transition={{
                  duration: reducedMotion ? 0 : 0.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <button
                aria-pressed={!showCode}
                onClick={() => setShowCode(false)}
              >
                Preview
              </button>
              <button aria-pressed={showCode} onClick={() => setShowCode(true)}>
                CSS
              </button>
            </div>
          </div>
          <div className="lab-body">
            <div className="lab-controls">
              <span className="lab-micro">YOUR CONTROLS</span>
              <fieldset>
                <legend>Accent</legend>
                <div className="lab-swatches">
                  {colors.map((color) => (
                    <label key={color.name} style={{ "--swatch": color.value }}>
                      <input
                        type="radio"
                        name="lab-accent"
                        value={color.name}
                        checked={color.name === accent.name}
                        onChange={() => setAccent(color)}
                      />
                      <span>{color.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="lab-range">
                Corner radius{" "}
                <output aria-label="Current corner radius">{radius}px</output>
                <input
                  aria-label="Corner radius"
                  type="range"
                  min="4"
                  max="32"
                  step="2"
                  value={radius}
                  onChange={(event) => setRadius(Number(event.target.value))}
                />
              </label>
              <fieldset>
                <legend>Shape presets</legend>
                <div
                  className="lab-shape-presets"
                  role="group"
                  aria-label="Shape presets"
                >
                  {[
                    ["Crisp", 6],
                    ["Soft", 20],
                    ["Round", 32],
                  ].map(([name, value]) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={radius === value}
                      onClick={() => setRadius(value)}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="lab-range">
                Step duration <output>{stepDuration}s</output>
                <input
                  aria-label="Step duration"
                  type="range"
                  min="2"
                  max="6"
                  step="1"
                  value={stepDuration}
                  onChange={(event) =>
                    setStepDuration(Number(event.target.value))
                  }
                />
              </label>
              <button
                className="lab-motion"
                aria-pressed={playing && !reducedMotion}
                disabled={!!reducedMotion}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing && !reducedMotion ? (
                  <Pause size={14} />
                ) : (
                  <Play size={14} />
                )}{" "}
                {reducedMotion
                  ? "Reduced motion on"
                  : playing
                    ? "Pause motion"
                    : "Play motion"}
              </button>
              <button className="lab-reset" type="button" onClick={resetLab}>
                <RotateCcw size={13} aria-hidden="true" /> Reset lab controls
              </button>
              <p>
                Local, interactive preview.
                <br />
                No lead is sent anywhere.
              </p>
            </div>
            <div className="lab-canvas">
              {showCode && (
                <div className="lab-code">
                  <div>
                    <span>workflow.css</span>
                    <button onClick={copy} aria-label="Copy workflow CSS">
                      {message === "CSS copied." ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}{" "}
                      Copy CSS
                    </button>
                  </div>
                  <pre>
                    <code>{code}</code>
                  </pre>
                  <p role="status">{message}</p>
                </div>
              )}
              <div className="lab-preview" hidden={showCode}>
                <div className="lab-canvas-heading">
                  <span>FROM INPUT TO INTENT</span>
                  <button
                    type="button"
                    className="lab-walkthrough"
                    disabled={!!reducedMotion}
                    aria-pressed={running}
                    onClick={() => {
                      if (running) setRunning(false);
                      else {
                        if (stageIndex === pipelineStages.length - 1)
                          setStageIndex(0);
                        setPlaying(true);
                        setRunning(true);
                      }
                    }}
                  >
                    {running ? (
                      <Pause size={13} aria-hidden="true" />
                    ) : (
                      <Play size={13} aria-hidden="true" />
                    )}
                    {running
                      ? "Pause walkthrough"
                      : stageIndex === pipelineStages.length - 1
                        ? "Replay walkthrough"
                        : "Run walkthrough"}
                  </button>
                </div>
                <div
                  ref={track}
                  className="lab-track"
                  role="tablist"
                  aria-label="LeadFlow stages"
                >
                  <span className="lab-track-line" aria-hidden="true">
                    <span
                      className="lab-track-progress"
                      style={{
                        width: `${(stageIndex / (pipelineStages.length - 1)) * 100}%`,
                      }}
                    />
                  </span>
                  {playing &&
                  !reducedMotion &&
                  visible &&
                  documentVisible &&
                  !showCode ? (
                    <AnimatedBeam
                      key={stageIndex}
                      containerRef={track}
                      fromRef={nodes.current[Math.max(0, stageIndex - 1)]}
                      toRef={nodes.current[Math.max(1, stageIndex)]}
                      pathColor="#8a9283"
                      gradientStartColor={accent.value}
                      gradientStopColor="#fffdf7"
                      duration={stepDuration}
                      pathWidth={2}
                    />
                  ) : null}
                  {pipelineStages.map((stage, i) => (
                    <button
                      key={stage.id}
                      ref={(el) => {
                        buttons.current[i] = el;
                      }}
                      role="tab"
                      aria-label={`0${i + 1} ${stageLabels[i]}`}
                      id={`lab-tab-${stage.id}`}
                      aria-selected={stageIndex === i}
                      aria-controls="lab-stage"
                      tabIndex={stageIndex === i ? 0 : -1}
                      data-visited={i < stageIndex || undefined}
                      onClick={() => selectStage(i)}
                      onKeyDown={(event) => keyboard(event, i)}
                    >
                      <span
                        ref={(el) => {
                          nodes.current[i].current = el;
                        }}
                      >
                        {i < stageIndex ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <strong>{stageLabels[i]}</strong>
                    </button>
                  ))}
                </div>
                <div
                  className="lab-playback-status"
                  role="status"
                  aria-label="Workflow walkthrough status"
                >
                  <span>
                    <i aria-hidden="true" />{" "}
                    {advancing
                      ? "Walking through"
                      : running
                        ? "Paused at"
                        : "Selected"}{" "}
                    {stageLabels[stageIndex]}
                  </span>
                  <span>{String(stageIndex + 1).padStart(2, "0")} / 05</span>
                </div>
                <div
                  className="lab-stage-detail"
                  id="lab-stage"
                  role="tabpanel"
                  aria-labelledby={`lab-tab-${active.id}`}
                >
                  <m.div
                    className="lab-stage-content"
                    key={active.id}
                    initial={
                      reducedMotion
                        ? false
                        : { opacity: 0, y: 12, filter: "blur(4px)" }
                    }
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div className="lab-stage-summary">
                      <span className="lab-micro">
                        0{stageIndex + 1} / SELECTED STAGE
                      </span>
                      <h3>{active.label}</h3>
                      <p>{active.decision}</p>
                    </div>
                    <div className="lab-io">
                      <div>
                        <span>INPUT</span>
                        <p>{active.input}</p>
                      </div>
                      <ArrowRight size={18} aria-hidden="true" />
                      <div>
                        <span>OUTPUT</span>
                        <p>{active.output}</p>
                      </div>
                    </div>
                    <div className="lab-boundary">
                      <span>WHEN SOMETHING GOES WRONG</span>
                      <p>{active.boundary}</p>
                    </div>
                  </m.div>
                </div>
                <div className="lab-canvas-footer">
                  <span>Real workflow decisions. Custom interface.</span>
                  <Link to="/work/leadflow">
                    See the full system <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </PointerSurface>
      </div>
    </section>
  );
}

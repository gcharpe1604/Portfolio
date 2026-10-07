import {
  ArrowUpRight,
  Code2,
  GitPullRequest,
  Grip,
  RotateCcw,
  Workflow,
} from "lucide-react";
import { m, useReducedMotion, useMotionValue, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { assets } from "../data/assets";
import { projects } from "../data/site";
import { ResponsiveImage } from "./ResponsiveImage";
import { MediaDialog } from "./MediaDialog";

const views = [
  {
    label: "Product",
    title: "GitAnalyzer",
    icon: Code2,
    asset: assets.gitAnalyzerDashboard,
    caption: "Repository history → developer feedback",
    detail: "Explainable analysis. A real product you can explore.",
    href: projects.gitAnalyzer.links.caseStudy,
  },
  {
    label: "System",
    title: "Harbor CLI",
    icon: GitPullRequest,
    asset: assets.harborTerminal,
    caption: "Unfamiliar code → reviewed contributions",
    detail: "Garbage-collection history · PR #1030 · In review",
    href: "/open-source?org=harbor",
  },
  {
    label: "Workflow",
    title: "LeadFlow",
    icon: Workflow,
    asset: assets.leadFlowWorkflow,
    caption: "Inbound lead → an inspectable routing plan",
    detail: "Validation, qualification, and explicit failure boundaries.",
    href: projects.leadFlow.links.caseStudy,
  },
];

export function HeroInspector() {
  const [index, setIndex] = useState(0);
  const tabs = useRef([]);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 24 });
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const positionX = useSpring(dragX, { stiffness: 300, damping: 30 });
  const positionY = useSpring(dragY, { stiffness: 300, damping: 30 });
  const dragging = useRef(null);
  const view = views[index];
  const Icon = view.icon;
  const move = (event) => {
    if (reducedMotion || dragging.current || event.pointerType !== "mouse")
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(-((event.clientY - rect.top) / rect.height - 0.5) * 6);
    y.set(((event.clientX - rect.left) / rect.width - 0.5) * 6);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const recenter = () => {
    dragX.set(0);
    dragY.set(0);
    reset();
  };
  const selectView = (next) => {
    setIndex(next);
    recenter();
  };
  const moveWindow = (event) => {
    const start = dragging.current;
    if (!start) return;
    dragX.set(
      Math.max(-24, Math.min(24, start.x + event.clientX - start.clientX)),
    );
    dragY.set(
      Math.max(-22, Math.min(22, start.y + event.clientY - start.clientY)),
    );
  };
  const moveWindowKeyboard = (event) => {
    const directions = {
      ArrowLeft: [-8, 0],
      ArrowRight: [8, 0],
      ArrowUp: [0, -8],
      ArrowDown: [0, 8],
    };
    if (directions[event.key]) {
      event.preventDefault();
      const [dx, dy] = directions[event.key];
      dragX.set(Math.max(-24, Math.min(24, dragX.get() + dx)));
      dragY.set(Math.max(-22, Math.min(22, dragY.get() + dy)));
    } else if (["Home", "Escape"].includes(event.key)) {
      event.preventDefault();
      recenter();
    }
  };
  const keyboard = (event, current) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? 2
          : (current + (event.key === "ArrowRight" ? 1 : 2)) % 3;
    selectView(next);
    tabs.current[next]?.focus();
  };
  return (
    <div className="hero-inspector">
      <div className="inspector-label">
        <span className="tiny-cross" aria-hidden="true">
          ✳
        </span>{" "}
        An interactive workbench <span>03 ways I build</span>
      </div>
      <div className="inspector-desk">
        <div className="inspector-desk-grid" aria-hidden="true" />
        <div className="inspector-desk-top">
          <span>
            <i aria-hidden="true" /> Explore my desk
          </span>
          <div className="inspector-desk-actions">
            <MediaDialog
              asset={view.asset}
              label="Inspect image"
              caption={`${view.title} / original project screenshot`}
            />
            <button
              type="button"
              aria-label="Reset preview position"
              onClick={recenter}
            >
              <RotateCcw size={13} aria-hidden="true" /> Reset
            </button>
          </div>
        </div>
        <div className="inspector-stack">
          <button
            type="button"
            className="inspector-back-card back-card-sage"
            aria-label={`Bring ${views[(index + 1) % views.length].title} to front`}
            onClick={() => selectView((index + 1) % views.length)}
          >
            <span>{views[(index + 1) % views.length].title}</span>
            <span>↗</span>
          </button>
          <button
            type="button"
            className="inspector-back-card back-card-gold"
            aria-label={`Bring ${views[(index + 2) % views.length].title} to front`}
            onClick={() => selectView((index + 2) % views.length)}
          >
            <span>{views[(index + 2) % views.length].title}</span>
            <span>↗</span>
          </button>
          <m.div
            className="inspector-floating"
            style={{
              x: reducedMotion ? dragX : positionX,
              y: reducedMotion ? dragY : positionY,
            }}
          >
            <div
              className="inspector-perspective"
              onPointerMove={move}
              onPointerLeave={reset}
              onPointerCancel={reset}
            >
              <m.div
                className="inspector-window"
                style={reducedMotion ? undefined : { rotateX, rotateY }}
              >
                <div className="inspector-toolbar">
                  <span>
                    <i />
                    <Icon size={15} aria-hidden="true" />
                    {view.title}
                  </span>
                  <button
                    type="button"
                    className="inspector-drag-handle"
                    aria-label="Move project preview"
                    aria-describedby="inspector-move-help"
                    onPointerDown={(event) => {
                      if (event.button !== 0) return;
                      reset();
                      dragging.current = {
                        clientX: event.clientX,
                        clientY: event.clientY,
                        x: dragX.get(),
                        y: dragY.get(),
                      };
                      event.currentTarget.setPointerCapture(event.pointerId);
                    }}
                    onPointerMove={moveWindow}
                    onPointerUp={() => {
                      dragging.current = null;
                    }}
                    onPointerCancel={() => {
                      dragging.current = null;
                    }}
                    onLostPointerCapture={() => {
                      dragging.current = null;
                    }}
                    onKeyDown={moveWindowKeyboard}
                  >
                    <Grip size={16} aria-hidden="true" />
                    <span>Move me</span>
                  </button>
                </div>
                <div
                  className={`inspector-media inspector-screenshot inspector-${index}`}
                  role="tabpanel"
                  id="inspector-panel"
                  aria-labelledby={`inspector-tab-${index}`}
                >
                  <m.div
                    key={view.title}
                    className="inspector-image-transition"
                    initial={
                      reducedMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 14,
                            scale: 0.975,
                            filter: "blur(5px)",
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                    }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      to={view.href}
                      aria-label={
                        index === 0
                          ? "View GitAnalyzer case study"
                          : `Explore ${view.title}`
                      }
                    >
                      <ResponsiveImage
                        asset={view.asset}
                        loading="eager"
                        fetchPriority={index === 0 ? "high" : undefined}
                        sizes="(max-width: 850px) 92vw, 48vw"
                      />
                      <span className="inspector-open">
                        <ArrowUpRight size={21} aria-hidden="true" /> Explore
                        the work
                      </span>
                    </Link>
                  </m.div>
                </div>
              </m.div>
            </div>
          </m.div>
        </div>
        <span className="inspector-desk-help" id="inspector-move-help">
          Choose a card. Drag or use arrow keys; Home resets the window.
        </span>
        <div
          className="inspector-tabs inspector-desk-tabs"
          role="tablist"
          aria-label="Explore product, system, and workflow"
        >
          <m.span
            className="inspector-tab-indicator"
            aria-hidden="true"
            initial={false}
            animate={{ x: `${index * 100}%` }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 320, damping: 32 }
            }
          />
          {views.map((item, i) => (
            <button
              key={item.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`inspector-tab-${i}`}
              role="tab"
              aria-selected={index === i}
              aria-controls="inspector-panel"
              tabIndex={index === i ? 0 : -1}
              onClick={() => {
                selectView(i);
              }}
              onKeyDown={(event) => keyboard(event, i)}
            >
              <span>0{i + 1}</span> {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="inspector-caption" aria-live="polite">
        <strong>{view.caption}</strong>
        <span>{view.detail}</span>
      </div>
    </div>
  );
}

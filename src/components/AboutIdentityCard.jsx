import {
  AnimatePresence,
  m,
  useIsPresent,
  useReducedMotion,
} from "motion/react";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { PointerSurface } from "./PointerSurface";

const chapters = [
  {
    label: "Now",
    title: "Exploring",
    emphasis: "what’s underneath.",
    noteTitle: "Learning by building.",
    note: "I’m working on an AI agent debugging and trace analysis platform while deepening my understanding of backend systems and databases.",
  },
  {
    label: "Approach",
    title: "Build. Read.",
    emphasis: "Review. Repeat.",
    noteTitle: "Learn from real code.",
    note: "My own projects taught me to turn ideas into software. Open source taught me to read unfamiliar systems, respond to review, and make changes that fit.",
  },
  {
    label: "Background",
    title: "From interfaces",
    emphasis: "to systems.",
    noteTitle: "A work in progress.",
    note: "I’m a second-year computer science student at Polaris School of Technology in Bengaluru, growing from frontend applications toward backend and cloud-native engineering.",
  },
];

function CardMessage({ chapter, note = false, reducedMotion }) {
  const isPresent = useIsPresent();
  return (
    <m.div
      className={note ? "identity-note" : "identity-motto"}
      aria-hidden={!isPresent || undefined}
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{
        duration: reducedMotion ? 0 : 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {note ? (
        <>
          <h3>{chapter.noteTitle}</h3>
          <p>{chapter.note}</p>
        </>
      ) : (
        <p>
          {chapter.title}
          <br />
          <em>{chapter.emphasis}</em>
        </p>
      )}
    </m.div>
  );
}

export function AboutIdentityCard({ selected }) {
  const [flipped, setFlipped] = useState(false);
  const reducedMotion = useReducedMotion();
  const chapter = chapters[selected];
  return (
    <PointerSurface className="about-identity" tilt glow={false}>
      <m.div
        className="identity-rotor"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{
          duration: reducedMotion ? 0 : 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="identity-face identity-front" aria-hidden={flipped}>
          <div className="identity-card-heading">
            <span>HELLO, I’M</span>
            <span className="identity-chapter">{chapter.label}</span>
          </div>
          <strong className="identity-monogram" aria-hidden="true">
            gc<span>.</span>
          </strong>
          <div className="identity-message-window">
            <AnimatePresence mode="wait" initial={false}>
              <CardMessage
                key={selected}
                chapter={chapter}
                reducedMotion={reducedMotion}
              />
            </AnimatePresence>
          </div>
          <span className="identity-location">BENGALURU, INDIA ↗</span>
          <span className="identity-reflection" aria-hidden="true" />
        </div>
        <div
          className="identity-face identity-back"
          id="about-card-note"
          aria-hidden={!flipped}
        >
          <div className="identity-card-heading">
            <span>A PERSONAL NOTE</span>
            <span className="identity-chapter">{chapter.label}</span>
          </div>
          <span className="identity-note-mark" aria-hidden="true">
            ✳
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <CardMessage
              key={selected}
              chapter={chapter}
              note
              reducedMotion={reducedMotion}
            />
          </AnimatePresence>
        </div>
      </m.div>
      <button
        type="button"
        className="identity-flip-control"
        aria-expanded={flipped}
        aria-controls="about-card-note"
        onClick={() => setFlipped((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setFlipped(false);
        }}
      >
        <span>{flipped ? "Back to card" : "Explore my story"}</span>
        <RotateCw size={16} aria-hidden="true" />
      </button>
    </PointerSurface>
  );
}

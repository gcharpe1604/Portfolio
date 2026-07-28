import { useEffect, useRef } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

const getCursorLabel = (target) => {
  if (!(target instanceof Element)) return "";
  const explicit = target.closest("[data-cursor]");
  if (explicit?.dataset.cursor) return explicit.dataset.cursor;
  if (target.closest(".media-expand")) return "Expand";
  if (target.closest("a")) return "Open";
  if (target.closest("button, [role='tab']")) return "Select";
  return "";
};

export function ProofCursor() {
  const cursorRef = useRef(null);
  const labelRef = useRef(null);
  const frameRef = useRef(0);
  const hasFinePointer = useMediaQuery("(pointer: fine)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label || !hasFinePointer || reduceMotion) return undefined;

    const updatePosition = (event) => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = window.requestAnimationFrame(() => {
        const rootFontSize =
          Number.parseFloat(
            window.getComputedStyle(document.documentElement).fontSize,
          ) || 16;
        cursor.style.setProperty(
          "--cursor-x",
          `${event.clientX / rootFontSize}rem`,
        );
        cursor.style.setProperty(
          "--cursor-y",
          `${event.clientY / rootFontSize}rem`,
        );
        cursor.dataset.visible = "true";
        frameRef.current = 0;
      });
    };

    const updateIntent = (event) => {
      const nextLabel = getCursorLabel(event.target);
      label.textContent = nextLabel;
      cursor.dataset.intent = nextLabel ? "true" : "false";
    };

    const hide = () => {
      cursor.dataset.visible = "false";
    };

    window.addEventListener("pointermove", updatePosition, { passive: true });
    document.addEventListener("pointerover", updateIntent, { passive: true });
    document.documentElement.classList.add("proof-cursor-ready");
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("pointermove", updatePosition);
      document.removeEventListener("pointerover", updateIntent);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.classList.remove("proof-cursor-ready");
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [hasFinePointer, reduceMotion]);

  return (
    <div
      ref={cursorRef}
      className="proof-cursor"
      data-visible="false"
      data-intent="false"
      aria-hidden="true"
    >
      <span className="proof-cursor-mark" />
      <span ref={labelRef} className="proof-cursor-label" />
    </div>
  );
}

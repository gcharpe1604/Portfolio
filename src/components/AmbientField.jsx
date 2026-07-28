import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export function AmbientField() {
  const fieldRef = useRef(null);
  const frameRef = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const field = fieldRef.current;
    const hero = field?.parentElement;
    if (!field || !hero || reduceMotion) return undefined;

    const updateField = (event) => {
      if (event.pointerType === "touch") return;
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);

      frameRef.current = window.requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const x = Math.min(
          100,
          Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100),
        );
        const y = Math.min(
          100,
          Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100),
        );
        const shiftX = (x - 50) * 0.16;
        const shiftY = (y - 50) * 0.1;
        const rootFontSize =
          Number.parseFloat(
            window.getComputedStyle(document.documentElement).fontSize,
          ) || 16;

        field.style.setProperty("--field-x", `${x}%`);
        field.style.setProperty("--field-y", `${y}%`);
        field.style.setProperty(
          "--field-shift-x",
          `${shiftX / rootFontSize}rem`,
        );
        field.style.setProperty(
          "--field-shift-y",
          `${shiftY / rootFontSize}rem`,
        );
        hero.style.setProperty("--hero-x", `${x}%`);
        hero.style.setProperty("--hero-y", `${y}%`);
        hero.style.setProperty("--hero-tilt-x", `${(50 - y) * 0.035}deg`);
        hero.style.setProperty("--hero-tilt-y", `${(x - 50) * 0.045}deg`);
        frameRef.current = 0;
      });
    };

    const resetField = () => {
      field.style.removeProperty("--field-x");
      field.style.removeProperty("--field-y");
      field.style.removeProperty("--field-shift-x");
      field.style.removeProperty("--field-shift-y");
      hero.style.removeProperty("--hero-x");
      hero.style.removeProperty("--hero-y");
      hero.style.removeProperty("--hero-tilt-x");
      hero.style.removeProperty("--hero-tilt-y");
    };

    hero.addEventListener("pointermove", updateField, { passive: true });
    hero.addEventListener("pointerleave", resetField);

    return () => {
      hero.removeEventListener("pointermove", updateField);
      hero.removeEventListener("pointerleave", resetField);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [reduceMotion]);

  return (
    <div ref={fieldRef} className="ambient-field" aria-hidden="true">
      <span className="ambient-sheet ambient-sheet-coral" />
      <span className="ambient-sheet ambient-sheet-gold" />
      <span className="ambient-word ambient-word-build">BUILD</span>
      <span className="ambient-word ambient-word-prove">PROVE</span>
      <span className="ambient-bracket">[</span>
      <span className="ambient-asterisk">✦</span>
    </div>
  );
}

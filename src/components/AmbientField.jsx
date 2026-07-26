import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const CENTER = {
  x: "68%",
  y: "28%",
  shiftX: "0px",
  shiftY: "0px",
};

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

        field.style.setProperty("--field-x", `${x}%`);
        field.style.setProperty("--field-y", `${y}%`);
        field.style.setProperty("--field-shift-x", `${shiftX}px`);
        field.style.setProperty("--field-shift-y", `${shiftY}px`);
        frameRef.current = 0;
      });
    };

    const resetField = () => {
      field.style.setProperty("--field-x", CENTER.x);
      field.style.setProperty("--field-y", CENTER.y);
      field.style.setProperty("--field-shift-x", CENTER.shiftX);
      field.style.setProperty("--field-shift-y", CENTER.shiftY);
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
      <span className="ambient-field-light" />
      <svg
        className="ambient-field-contours"
        viewBox="0 0 1600 760"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-180 690C90 434 296 724 554 512C808 304 998 482 1250 274C1418 136 1556 168 1744 52" />
        <path d="M-206 620C54 386 278 650 518 454C764 254 970 420 1210 224C1402 68 1564 122 1768-22" />
        <path d="M-238 548C10 334 244 580 486 396C716 220 928 356 1168 172C1376 14 1550 84 1778-92" />
        <path d="M-258 470C-22 280 218 512 450 338C682 164 888 300 1126 120C1338-42 1542 52 1794-168" />
        <path d="M-286 392C-56 224 180 444 416 282C644 124 850 240 1080 72C1298-88 1514 10 1806-228" />
        <path d="M-318 306C-96 172 150 378 382 224C604 78 810 184 1038 28C1266-128 1492-24 1816-286" />
      </svg>
      <span className="ambient-field-falloff" />
    </div>
  );
}

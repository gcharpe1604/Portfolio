import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export function PointerSurface({
  children,
  className = "",
  style,
  tilt = false,
  glow = true,
}) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 170, damping: 26 });
  const rotateY = useSpring(y, { stiffness: 170, damping: 26 });
  const move = (event) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    event.currentTarget.style.setProperty("--pointer-x", `${px}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${py}px`);
    event.currentTarget.style.setProperty("--pointer-intensity", "1");
    if (tilt) {
      x.set(-(py / rect.height - 0.5) * 4);
      y.set((px / rect.width - 0.5) * 4);
    }
  };
  const reset = (event) => {
    x.set(0);
    y.set(0);
    event.currentTarget.style.setProperty("--pointer-intensity", "0");
  };
  return (
    <m.div
      className={`pointer-surface ${glow ? "has-spotlight" : ""} ${className}`}
      style={{
        ...style,
        ...(tilt && !reducedMotion
          ? { rotateX, rotateY, transformPerspective: 1200 }
          : {}),
      }}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </m.div>
  );
}

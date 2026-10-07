import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import "./HeroDotBackground.css";

export function HeroDotBackground() {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!window.CanvasRenderingContext2D) return undefined;
    const context = canvas.getContext("2d");
    if (!context) return undefined;
    const layer = canvas.parentElement;
    const hero = layer.parentElement;
    const pointerMedia = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    let particles = [];
    let colors = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastTime = 0;
    let phase = 0;
    let visible = true;
    let dark = false;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const canAnimate = () => !reducedMotion && pointerMedia.matches;

    const readPalette = () => {
      dark = document.documentElement.dataset.theme === "dark";
      const stops = dark
        ? [
            [126, 162, 255],
            [182, 137, 238],
            [236, 139, 180],
            [255, 148, 127],
            [229, 188, 84],
          ]
        : [
            [76, 109, 223],
            [136, 86, 186],
            [192, 92, 137],
            [225, 110, 88],
            [186, 144, 51],
          ];
      colors = Array.from({ length: 96 }, (_, i) => {
        const position = (i / 95) * (stops.length - 1);
        const index = Math.min(Math.floor(position), stops.length - 2);
        const mix = position - index;
        return `rgb(${stops[index]
          .map((value, channel) =>
            Math.round(value + (stops[index + 1][channel] - value) * mix),
          )
          .join(",")})`;
      });
    };

    const paint = () => {
      context.clearRect(0, 0, width, height);
      context.lineCap = "round";
      const driftX =
        Math.sin(phase * 0.31) * width * 0.08 + pointer.x * width * 0.1;
      const driftY =
        Math.cos(phase * 0.23) * height * 0.07 + pointer.y * height * 0.08;
      for (const particle of particles) {
        const u = particle.x - driftX;
        const v = particle.y - driftY;
        // Project a gently folding sheet: near crests become larger, brighter dashes.
        const wave = u * 0.0045 + v * 0.003 + phase * 0.52;
        const fold =
          Math.sin(wave) * 0.65 + Math.cos(v * 0.006 - phase * 0.35) * 0.35;
        const depth = (fold + 1) / 2;
        const scale = 560 / (560 - fold * 175);
        const bend = Math.sin(v * 0.005 + phase * 0.2) * 24;
        const x = width / 2 + (particle.x + bend + driftX * 0.16) * scale;
        const y =
          height / 2 +
          (particle.y + Math.cos(wave) * 18 + driftY * 0.16) * scale;
        if (x < -4 || x > width + 4 || y < -4 || y > height + 4) continue;
        const length = 0.25 + Math.pow(depth, 2.5) * 2.3;
        const angle = wave * 0.6 + v * 0.002 + phase * 0.1;
        const dx = (Math.cos(angle) * length) / 2;
        const dy = (Math.sin(angle) * length) / 2;
        const hue = (Math.sin(u * 0.0022 - v * 0.0015 + phase * 0.28) + 1) / 2;
        context.strokeStyle = colors[Math.round(hue * 95)];
        context.globalAlpha = (dark ? 0.24 : 0.2) + depth * 0.45;
        context.lineWidth = 0.45 + depth * 0.42 + particle.grain * 0.12;
        context.beginPath();
        context.moveTo(x - dx, y - dy);
        context.lineTo(x + dx, y + dy);
        context.stroke();
      }
      context.globalAlpha = 1;
    };

    const tick = (time) => {
      frame = 0;
      const step = Math.min((time - (lastTime || time)) / 1000, 0.05);
      lastTime = time;
      phase += step;
      const follow = 1 - Math.exp(-step * 4);
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      paint();
      start();
    };
    const start = () => {
      if (!frame && visible && !document.hidden && canAnimate())
        frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const reset = () => {
      pointer.targetX = 0;
      pointer.targetY = 0;
      if (canAnimate()) start();
      else {
        stop();
        pointer.x = 0;
        pointer.y = 0;
        paint();
      }
    };
    const move = (event) => {
      if (!canAnimate() || event.pointerType !== "mouse") return;
      const box = hero.getBoundingClientRect();
      pointer.targetX = ((event.clientX - box.left) / width - 0.5) * 2;
      pointer.targetY = ((event.clientY - box.top) / height - 0.5) * 2;
      start();
    };
    const resize = () => {
      stop();
      const box = hero.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = [];
      // Extra margins keep the projected field covering every edge as it folds.
      const area = width * height * 2.25;
      const spacing = Math.max(14, Math.sqrt(area / 24000));
      for (let y = -height * 0.75; y < height * 0.75; y += spacing) {
        for (let x = -width * 0.75; x < width * 0.75; x += spacing) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const grain = seed - Math.floor(seed);
          particles.push({ x: x + (grain - 0.5) * 3, y, grain });
        }
      }
      paint();
      start();
    };
    const recolor = () => {
      readPalette();
      paint();
    };
    const visibility = () => {
      if (document.hidden) stop();
      else reset();
    };

    readPalette();
    resize();
    layer.classList.add("is-ready");
    const sizeObserver = new ResizeObserver(resize);
    sizeObserver.observe(hero, { box: "border-box" });
    const themeObserver = new MutationObserver(recolor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const viewObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
      else reset();
    });
    viewObserver.observe(hero);
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    hero.addEventListener("pointercancel", reset);
    pointerMedia.addEventListener("change", reset);
    document.addEventListener("visibilitychange", visibility);

    return () => {
      stop();
      sizeObserver.disconnect();
      themeObserver.disconnect();
      viewObserver.disconnect();
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      hero.removeEventListener("pointercancel", reset);
      pointerMedia.removeEventListener("change", reset);
      document.removeEventListener("visibilitychange", visibility);
      layer.classList.remove("is-ready");
    };
  }, [reducedMotion]);

  return (
    <div className="hero-dot-background" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}

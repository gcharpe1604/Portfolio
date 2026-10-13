import { useEffect, useId, useRef, useState } from "react";
import { useBrowserLayoutEffect } from "../hooks/useBrowserLayoutEffect";

const mapCache = new Map();

// A rounded lens uses a continuous depth profile, rather than an outline-only
// effect. The optical falloff follows Glass-HQ's liquid-glass implementation;
// a gentle magnification also makes the live backdrop read through the body.
// Reference: https://github.com/Glass-HQ/liquid-glass/blob/main/packages/liquid-glass/src/core/optics.ts
function lensMap(width, height) {
  const key = `${width}:${height}`;
  if (mapCache.has(key)) return mapCache.get(key);
  const bounds = { width, height };
  // The browser interpolates this small texture across the lens. Half-size
  // sampling keeps the curved rim smooth while avoiding a full-size pixel loop.
  width = Math.ceil(width / 2);
  height = Math.ceil(height / 2);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  const image = context.createImageData(width, height);
  const light = context.createImageData(width, height);
  const radius = Math.min(width, height) / 2;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = Math.abs(x + 0.5 - width / 2) - (width / 2 - radius);
      const dy = Math.abs(y + 0.5 - height / 2) - (height / 2 - radius);
      const ax = Math.max(dx, 0);
      const ay = Math.max(dy, 0);
      const length = Math.sqrt(ax * ax + ay * ay);
      const distance = radius - length - Math.min(Math.max(dx, dy), 0);
      const depth = Math.min(1, Math.max(0, distance / 10));
      const bend = 1 - Math.sqrt((2 - depth) * depth);
      const nx = length ? ax / length : 0;
      const ny = length ? ay / length : 1;
      const offset = (y * width + x) * 4;
      const zoomX = ((x + 0.5 - width / 2) / width) * 0.1;
      const zoomY = ((y + 0.5 - height / 2) / height) * 0.06;
      image.data[offset] =
        128 - (Math.sign(x + 0.5 - width / 2) * nx * bend + zoomX) * 120;
      image.data[offset + 1] =
        128 - (Math.sign(y + 0.5 - height / 2) * ny * bend + zoomY) * 120;
      image.data[offset + 2] = 128;
      image.data[offset + 3] = 255;
      // Directional specular and diffuse light follow the surface normal,
      // matching the reference's illuminated top/bottom and quieter side walls.
      const direction = Math.pow(
        Math.max(0, (Math.abs(ny) - Math.cos(1.08)) / (1 - Math.cos(1.08))),
        1.25,
      );
      const stroke = Math.max(0, 1 - Math.abs(distance * 2 - 0.65) / 1.25);
      const specular = direction * stroke;
      const diffuse =
        direction *
        0.18 *
        Math.pow(1 - Math.min(1, Math.max(0, (distance * 2) / 4.5)), 2);
      light.data[offset] =
        light.data[offset + 1] =
        light.data[offset + 2] =
          255;
      light.data[offset + 3] =
        distance >= 0
          ? Math.min(1, specular / (1 + 0.5 * (1 - specular)) + diffuse) * 255
          : 0;
    }
  }
  context.putImageData(image, 0, 0);
  const src = canvas.toDataURL();
  context.putImageData(light, 0, 0);
  const map = { src, highlight: canvas.toDataURL(), ...bounds };
  mapCache.set(key, map);
  if (mapCache.size > 16) mapCache.delete(mapCache.keys().next().value);
  return map;
}

export function NavbarGlass({ active, control = false, lensSize }) {
  const ref = useRef(null);
  const imageRefs = useRef([]);
  const sizeRef = useRef("");
  const filterId = `navbar-lens-${useId().replaceAll(":", "")}`;
  const [map, setMap] = useState(null);
  const targetWidth = lensSize?.width;
  const targetHeight = lensSize?.height;

  useEffect(() => {
    if (!map) return undefined;
    // Repaint when the actual images are decoded, rather than guessing their
    // readiness with delayed timers. Existing glass stays visible on resizing.
    let cancelled = false;
    let frame;
    const images = [map.src, map.highlight].map((src) => {
      const image = new Image();
      image.src = src;
      return image;
    });
    Promise.all(
      images.map((image) => image.decode().catch(() => undefined)),
    ).then(() => {
      if (cancelled) return;
      frame = window.requestAnimationFrame(() =>
        imageRefs.current.forEach((image) => image?.setAttribute("x", "0")),
      );
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [map]);

  useBrowserLayoutEffect(() => {
    // Use the verified Chromium SVG compositor; other engines retain native blur.
    if (!window.CanvasRenderingContext2D || !window.chrome) return undefined;
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const contrast = window.matchMedia("(forced-colors: active)");
    let timer;
    const hasTargetSize = targetWidth > 0 && targetHeight > 0;
    const measure = () => {
      const rect = ref.current.getBoundingClientRect();
      const width = Math.round(hasTargetSize ? targetWidth : rect.width);
      const height = Math.round(hasTargetSize ? targetHeight : rect.height);
      const size = `${width}:${height}`;
      if (!width || !height || size === sizeRef.current) return;
      sizeRef.current = size;
      setMap(lensMap(width, height));
    };
    const update = () => {
      window.clearTimeout(timer);
      if (!pointer.matches || reduced.matches || contrast.matches) {
        setMap(null);
        sizeRef.current = "";
        return;
      }
      // Prepare the first lens before paint, including while the navbar is at
      // the top. Later size changes stretch this lens until a final-size map
      // can replace it, without turning the material off or encoding each frame.
      // A moving navigation lens uses its destination size immediately. Its
      // texture then stretches with the spring, with no replacement on arrival.
      if (hasTargetSize || !sizeRef.current) measure();
      else timer = window.setTimeout(measure, 180);
    };
    update();
    const observer =
      !hasTargetSize && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;
    observer?.observe(ref.current);
    window.addEventListener("resize", update);
    for (const media of [pointer, reduced, contrast])
      media.addEventListener("change", update);
    return () => {
      window.clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener("resize", update);
      for (const media of [pointer, reduced, contrast])
        media.removeEventListener("change", update);
    };
  }, [targetWidth, targetHeight]);

  return (
    <span
      ref={ref}
      className={`pf-navbar-glass${control ? " is-control" : ""}`}
      data-active={active}
      aria-hidden="true"
    >
      {map && (
        <svg
          className="navbar-glass-defs"
          width="100%"
          height="100%"
          focusable="false"
        >
          <defs>
            {["light", "dark"].map((appearance, index) => (
              <filter
                key={appearance}
                id={`${filterId}-${appearance}`}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={control ? "0.6" : "1.8"}
                  result="soft"
                />
                <feImage
                  ref={(image) => {
                    imageRefs.current[index * 2] = image;
                  }}
                  x="0"
                  y="0"
                  href={map?.src}
                  preserveAspectRatio="none"
                  width="100%"
                  height="100%"
                  result="lens"
                />
                <feDisplacementMap
                  in="soft"
                  in2="lens"
                  scale={control ? "20" : "60"}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
                <feColorMatrix type="saturate" values="1.12" />
                <feComponentTransfer result="glass">
                  {["R", "G", "B"].map((channel) => {
                    const Channel = `feFunc${channel}`;
                    return (
                      <Channel
                        key={channel}
                        type="linear"
                        slope={appearance === "light" ? 1 : 0.7}
                        intercept={0}
                      />
                    );
                  })}
                </feComponentTransfer>
                <feImage
                  ref={(image) => {
                    imageRefs.current[index * 2 + 1] = image;
                  }}
                  x="0"
                  y="0"
                  href={map?.highlight}
                  preserveAspectRatio="none"
                  width="100%"
                  height="100%"
                  result="reflection"
                />
                <feComponentTransfer in="reflection" result="shine">
                  <feFuncA
                    type="linear"
                    slope={appearance === "light" ? "1" : "0.82"}
                  />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glass" />
                  <feMergeNode in="shine" />
                </feMerge>
              </filter>
            ))}
          </defs>
        </svg>
      )}
      <span
        className="navbar-glass-lens"
        // Keep the same material while opacity fades on returning to the top.
        // Switching to the fallback here would change blur/tint mid-transition.
        data-ready={!!map}
        style={{
          "--navbar-lens-light": map ? `url("#${filterId}-light")` : "none",
          "--navbar-lens-dark": map ? `url("#${filterId}-dark")` : "none",
        }}
      />
      <span className="navbar-glass-backdrop" />
      <span className="navbar-glass-rim" />
    </span>
  );
}

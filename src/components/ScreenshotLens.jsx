import { useEffect, useId, useRef, useState } from "react";
import { ScanSearch } from "lucide-react";
import { MediaDialog } from "./MediaDialog";
import { ResponsiveImage } from "./ResponsiveImage";

export function ScreenshotLens({ asset, caption }) {
  const [enabled, setEnabled] = useState(false);
  const [point, setPoint] = useState({ x: 0.5, y: 0.5 });
  const [size, setSize] = useState({ width: 1, height: 1 });
  const viewport = useRef(null);
  const instructionId = useId();
  const viewportId = useId();
  const toggleRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const element = viewport.current;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize({ width: rect.width || 1, height: rect.height || 1 });
    };
    measure();
    element.focus({ preventScroll: true });
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);
  const clamp = (value) => Math.max(0, Math.min(1, value));
  const move = (event) => {
    if (!enabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setPoint({
      x: clamp((event.clientX - rect.left) / rect.width),
      y: clamp((event.clientY - rect.top) / rect.height),
    });
  };
  const keyboard = (event) => {
    if (!enabled) return;
    const directions = {
      ArrowLeft: [-0.05, 0],
      ArrowRight: [0.05, 0],
      ArrowUp: [0, -0.05],
      ArrowDown: [0, 0.05],
    };
    if (directions[event.key]) {
      event.preventDefault();
      const [x, y] = directions[event.key];
      setPoint((previous) => ({
        x: clamp(previous.x + x),
        y: clamp(previous.y + y),
      }));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPoint({ x: 0.5, y: 0.5 });
    } else if (event.key === "Escape") {
      event.preventDefault();
      setEnabled(false);
      toggleRef.current?.focus();
    }
  };
  // Match object-fit: contain so portrait screenshots also magnify accurately.
  const imageWidth = Math.min(
    size.width,
    (size.height * asset.width) / asset.height,
  );
  const imageHeight = (imageWidth * asset.height) / asset.width;
  const offsetX = (size.width - imageWidth) / 2;
  const offsetY = (size.height - imageHeight) / 2;
  const x = Math.max(
    offsetX,
    Math.min(size.width * point.x, offsetX + imageWidth),
  );
  const y = Math.max(
    offsetY,
    Math.min(size.height * point.y, offsetY + imageHeight),
  );
  const diameter = Math.min(172, size.width * 0.48);
  const zoom = 2.2;
  return (
    <div className="screenshot-inspector">
      <div
        ref={viewport}
        id={viewportId}
        className={`pf-preview-image screenshot-viewport${enabled ? " is-inspecting" : ""}`}
        role="group"
        aria-label="Screenshot inspection area"
        aria-describedby={enabled ? instructionId : undefined}
        tabIndex={enabled ? 0 : -1}
        onPointerMove={move}
        onPointerDown={move}
        onKeyDown={keyboard}
      >
        <ResponsiveImage asset={asset} sizes="(max-width: 850px) 90vw, 55vw" />
        {enabled && (
          <div
            className="screenshot-lens"
            aria-hidden="true"
            style={{
              left: x,
              top: y,
              width: diameter,
              height: diameter,
              backgroundImage: `url("${asset.src}")`,
              backgroundSize: `${imageWidth * zoom}px ${imageHeight * zoom}px`,
              backgroundPosition: `${diameter / 2 - (x - offsetX) * zoom}px ${diameter / 2 - (y - offsetY) * zoom}px`,
            }}
          >
            <span>2.2×</span>
          </div>
        )}
      </div>
      <div className="screenshot-tools">
        <button
          ref={toggleRef}
          type="button"
          aria-pressed={enabled}
          aria-controls={viewportId}
          onClick={() => {
            setEnabled((previous) => !previous);
            setPoint({ x: 0.5, y: 0.5 });
          }}
        >
          <ScanSearch size={15} aria-hidden="true" /> Inspect screenshot
        </button>
        <MediaDialog
          asset={asset}
          label="Expand screenshot"
          caption={caption}
        />
      </div>
      {enabled && (
        <p className="screenshot-instructions" id={instructionId}>
          Move your pointer, touch the image, or use arrow keys. Esc exits.
        </p>
      )}
    </div>
  );
}

import { m } from "motion/react";
import { useEffect, useId, useState } from "react";

export function AnimatedBeam({
  className = "",
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  ease = "linear",
  pathColor = "currentColor",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  repeat = Infinity,
  repeatDelay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) {
  const id = useId();
  const [path, setPath] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      };

  useEffect(() => {
    const updatePath = () => {
      const container = containerRef.current;
      const from = fromRef.current;
      const to = toRef.current;
      if (!container || !from || !to) return;

      const containerRect = container.getBoundingClientRect();
      const fromRect = from.getBoundingClientRect();
      const toRect = to.getBoundingClientRect();
      const startX =
        fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY =
        fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX =
        toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY =
        toRect.top - containerRect.top + toRect.height / 2 + endYOffset;
      const controlY = startY - curvature;

      setDimensions({
        width: containerRect.width,
        height: containerRect.height,
      });
      setPath(
        `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`,
      );
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updatePath);

    if (containerRef.current) resizeObserver?.observe(containerRef.current);
    window.addEventListener("resize", updatePath);
    updatePath();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updatePath);
    };
  }, [
    containerRef,
    curvature,
    endXOffset,
    endYOffset,
    fromRef,
    startXOffset,
    startYOffset,
    toRef,
  ]);

  return (
    <svg
      aria-hidden="true"
      className={`animated-beam ${className}`.trim()}
      fill="none"
      focusable="false"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
    >
      <path
        d={path}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={path}
        stroke={`url(#${id})`}
        strokeWidth={pathWidth}
        strokeLinecap="round"
      />
      <defs>
        <m.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={gradientCoordinates}
          transition={{
            delay,
            duration,
            ease,
            repeat,
            repeatDelay,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </m.linearGradient>
      </defs>
    </svg>
  );
}

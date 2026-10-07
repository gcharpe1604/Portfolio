import { useEffect, useLayoutEffect } from "react";

// Measurements run before paint in the browser and never during static rendering.
export const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

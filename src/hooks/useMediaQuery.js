import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  // Match the static HTML on hydration, then apply the current device preference.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

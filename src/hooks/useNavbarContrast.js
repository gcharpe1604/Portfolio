import { useEffect } from "react";

const foreground = [
  ".pf-brand-mark > .pf-glass-foreground",
  ".pf-brand-name",
  ".pf-desktop-nav > .nav-link",
  ".pf-header-resume > .pf-glass-foreground",
  ".pf-header-actions > .icon-button > svg",
].join(",");

// Read backing surfaces without canvas snapshots or glass-material changes.
export function useNavbarContrast(innerRef, pathname, scrolled) {
  useEffect(() => {
    const inner = innerRef.current;
    const header = inner?.closest(".pf-site-header");
    if (!header || !document.elementsFromPoint) return undefined;
    let frame = 0;
    let colors = new WeakMap();
    const reduced = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const forced = window.matchMedia("(forced-colors: active)");
    const luminance = (element) => {
      if (colors.has(element)) return colors.get(element);
      const color = getComputedStyle(element).backgroundColor;
      const values = color.match(/[\d.]+/g)?.map(Number);
      let result = null;
      if (values?.length >= 3 && (values[3] ?? 1) >= 0.9) {
        const rgb = values.slice(0, 3).map((value) => {
          const channel = color.startsWith("color(srgb") ? value : value / 255;
          return channel <= 0.04045
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
        });
        result = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      }
      colors.set(element, result);
      return result;
    };
    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (
          document.documentElement.dataset.theme !== "light" ||
          !header.classList.contains("is-scrolled")
        )
          return;
        if (reduced.matches || forced.matches) {
          inner.querySelectorAll(foreground).forEach((element) => {
            delete element.dataset.navInk;
          });
          return;
        }
        const changes = [...inner.querySelectorAll(foreground)].map(
          (element) => {
            const box = element.getBoundingClientRect();
            if (!box.width || !box.height) return null;
            const surface = document
              .elementsFromPoint(box.x + box.width / 2, box.y + box.height / 2)
              .find((node) => !header.contains(node));
            let background = surface;
            let light = null;
            while (background && light === null) {
              light = luminance(background);
              background = background.parentElement;
            }
            return {
              element,
              ink: light !== null && light < 0.19 ? "light" : "dark",
            };
          },
        );
        // Batch reads before writes; color changes never resize the moving lens.
        for (const change of changes) {
          if (change && change.element.dataset.navInk !== change.ink)
            change.element.dataset.navInk = change.ink;
        }
      });
    };
    const refresh = () => {
      colors = new WeakMap();
      update();
    };
    update();
    const observer = new MutationObserver(refresh);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    resizeObserver?.observe(inner);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", refresh, { passive: true });
    document.addEventListener("load", refresh, true);
    document.addEventListener("pointerup", update, { passive: true });
    document.addEventListener("keydown", update);
    reduced.addEventListener("change", update);
    forced.addEventListener("change", update);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", refresh);
      document.removeEventListener("load", refresh, true);
      document.removeEventListener("pointerup", update);
      document.removeEventListener("keydown", update);
      reduced.removeEventListener("change", update);
      forced.removeEventListener("change", update);
    };
  }, [innerRef, pathname, scrolled]);
}

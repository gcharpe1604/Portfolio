import { useEffect, useId, useRef, useState } from "react";
import { ResponsiveImage } from "./ResponsiveImage";

export function MediaDialog({ asset, label = "Expand image", caption }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useId();
  const canvasId = useId();
  const [zoomed, setZoomed] = useState(false);
  const [opened, setOpened] = useState(false);

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    setOpened(true);
    setZoomed(false);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
    setOpened(false);
    setZoomed(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    const handleClick = (event) => {
      if (event.target === dialog) close();
    };
    dialog?.addEventListener("click", handleClick);
    return () => dialog?.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        className="media-expand"
        type="button"
        onClick={open}
      >
        <span>{label}</span>
      </button>
      <dialog
        ref={dialogRef}
        className="media-dialog"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="media-dialog-panel">
          <div className="media-dialog-header">
            <p id={titleId}>{caption || label}</p>
            <div className="media-dialog-actions">
              <button
                type="button"
                className="media-dialog-zoom"
                aria-controls={canvasId}
                aria-pressed={zoomed}
                aria-label={
                  zoomed
                    ? "Fit evidence image to dialog"
                    : "Zoom evidence image for detail"
                }
                onClick={() => setZoomed((current) => !current)}
              >
                <span>{zoomed ? "Fit" : "Zoom"}</span>
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={close}
                aria-label="Close expanded image"
              >
                Close
              </button>
            </div>
          </div>
          <div
            id={canvasId}
            role="group"
            className={`media-dialog-canvas${zoomed ? " is-zoomed" : ""}`}
            style={{ "--dialog-image-width": `${asset.width / 16}rem` }}
            tabIndex={zoomed ? 0 : -1}
            aria-label={
              zoomed
                ? "Zoomed evidence image. Scroll horizontally and vertically to inspect details."
                : "Evidence image"
            }
          >
            {opened && (
              <ResponsiveImage
                asset={asset}
                loading="eager"
                sizes={
                  zoomed
                    ? "(max-width: 47.9375rem) 75rem, 96vw"
                    : "(max-width: 47.9375rem) 96vw, 96vw"
                }
                className="dialog-image"
              />
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}

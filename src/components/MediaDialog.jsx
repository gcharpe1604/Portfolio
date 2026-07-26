import { Expand, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { ResponsiveImage } from "./ResponsiveImage";

export function MediaDialog({ asset, label = "Expand image", caption }) {
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const titleId = useId();

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
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
        <Expand size={17} aria-hidden="true" />
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
            <button
              type="button"
              className="icon-button"
              onClick={close}
              aria-label="Close expanded image"
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <ResponsiveImage
            asset={asset}
            loading="eager"
            sizes="96vw"
            className="dialog-image"
          />
        </div>
      </dialog>
    </>
  );
}

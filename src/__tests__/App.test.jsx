import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

function renderAt(path = "/") {
  window.history.pushState({}, "", path);
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.dataset.theme = "dark";
  window.matchMedia.mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  cleanup();
});

describe("portfolio routes and interactions", () => {
  it("renders the homepage hierarchy and verified proof data", async () => {
    renderAt("/");

    expect(
      await screen.findByRole(
        "heading",
        {
          level: 1,
          name: /I build software products/i,
        },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Selected work" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Skills, with evidence" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Open-source validation" }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "View résumé" }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(
        "OpenTrack — A GitHub-linked contribution-tracking platform currently under development.",
      ),
    ).toBeInTheDocument();
  });

  it("renders direct case-study, open-source, resume, and 404 routes", async () => {
    let view = renderAt("/work/gitanalyzer");
    expect(
      await screen.findByRole("heading", { level: 1, name: "GitAnalyzer" }),
    ).toBeInTheDocument();
    view.unmount();

    view = renderAt("/work/leadflow");
    expect(
      await screen.findByRole("heading", { level: 1, name: "LeadFlow" }),
    ).toBeInTheDocument();
    view.unmount();

    view = renderAt("/open-source");
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Engineering in codebases/i,
      }),
    ).toBeInTheDocument();
    view.unmount();

    view = renderAt("/resume");
    expect(
      await screen.findByRole("heading", { level: 1, name: "Govind Charpe" }),
    ).toBeInTheDocument();
    view.unmount();

    renderAt("/not-a-real-route");
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "This path is outside the system.",
      }),
    ).toBeInTheDocument();
  });

  it("opens and closes the mobile navigation sheet", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Mobile navigation",
    });
    expect(dialog).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", {
        name: "Close navigation menu",
      }),
    );
    expect(
      screen.queryByRole("dialog", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it("persists theme changes", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    await user.click(
      screen.getByRole("button", { name: "Switch to light theme" }),
    );
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem("gc-theme")).toBe("light");
  });

  it("updates GitAnalyzer detail controls without hiding essential copy", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    const detailButton = screen.getByRole("tab", {
      name: /^03\s*Repository-specific recommendations$/,
    });
    await user.click(detailButton);
    expect(detailButton).toHaveAttribute("aria-selected", "true");
    expect(
      await screen.findByText(
        "Generic advice is weaker than feedback tied to patterns in the repository being analyzed.",
      ),
    ).toBeInTheDocument();
  });

  it("selects proof, pipeline, and skill evidence with explicit controls", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    const proof = screen.getByRole("button", {
      name: "Select Harbor CLI proof",
    });
    await user.click(proof);
    expect(proof).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getAllByText("Garbage-collection history command").length,
    ).toBeGreaterThanOrEqual(1);

    const dispatch = screen.getByRole("tab", { name: /^05\s*Dispatch$/ });
    await user.click(dispatch);
    expect(dispatch).toHaveAttribute("aria-selected", "true");
    expect(
      await screen.findByText(
        "An auditable dispatch plan for the selected destination.",
      ),
    ).toBeInTheDocument();

    const goSkill = screen.getByRole("button", { name: "Go" });
    await user.click(goSkill);
    expect(goSkill).toHaveAttribute("aria-pressed", "true");
    expect(
      await screen.findByText("Growing through reviewed open source"),
    ).toBeInTheDocument();

    const ciSkill = screen.getByRole("button", {
      name: "CI/CD fundamentals",
    });
    await user.click(ciSkill);
    expect(ciSkill).toHaveAttribute("aria-pressed", "true");
    const ciHeading = await screen.findByRole(
      "heading",
      {
        level: 3,
        name: /CI\/CD\s*fundamentals/,
      },
      { timeout: 5000 },
    );
    expect(ciHeading.querySelector(".skill-heading-line")).toHaveTextContent(
      "fundamentals",
    );
  });

  it("stores organization and status filters in the URL", async () => {
    const user = userEvent.setup();
    renderAt("/open-source?org=musicblocks");
    await screen.findByRole("heading", { level: 1 });

    expect(
      screen.getByRole("button", { name: "Music Blocks" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Merged" }));
    expect(window.location.search).toContain("org=musicblocks");
    expect(window.location.search).toContain("status=merged");
    expect(
      screen.getByRole("heading", {
        name: "Added block-connection feedback",
      }),
    ).toBeInTheDocument();
  });

  it("copies the email independently of opening a mail client", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const clipboardSpy = vi.spyOn(navigator.clipboard, "writeText");

    await user.click(screen.getByRole("button", { name: "Copy email" }));
    expect(clipboardSpy).toHaveBeenCalledWith("govind.charpe16@gmail.com");
    expect(
      await screen.findByText("Email copied to clipboard.", {
        selector: ".copy-status",
      }),
    ).toBeInTheDocument();
  });

  it("opens an evidence dialog and restores focus when closed", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });

    const trigger = screen.getByRole("button", { name: "Expand evidence" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");

    const zoom = within(dialog).getByRole("button", {
      name: "Zoom evidence image for detail",
    });
    await user.click(zoom);
    expect(zoom).toHaveAttribute("aria-pressed", "true");
    expect(zoom).toHaveAccessibleName("Fit evidence image to dialog");
    expect(
      within(dialog).getByLabelText(
        "Zoomed evidence image. Scroll horizontally and vertically to inspect details.",
      ),
    ).toHaveAttribute("tabindex", "0");

    await user.click(
      within(dialog).getByRole("button", {
        name: "Close expanded image",
      }),
    );
    expect(dialog).not.toHaveAttribute("open");
    expect(trigger).toHaveFocus();
  });

  it("shows a static poster instead of video for reduced motion", async () => {
    window.matchMedia.mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    renderAt("/open-source?org=musicblocks");
    expect(
      await screen.findByAltText(/block is detached, moved, and reconnected/i),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText(/demonstration/i)).not.toBeInTheDocument();
  });
});

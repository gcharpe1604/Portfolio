import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { seoHead } from "../../scripts/seo.mjs";

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
  it("updates canonical, preview and structured data when navigating from a case study", async () => {
    const previousHead = document.head.innerHTML;
    try {
      document.head.innerHTML = seoHead(
        "/work/leadflow",
        "https://govind-charpe.netlify.app",
        "index, follow",
      );
      const user = userEvent.setup();
      renderAt("/work/leadflow");
      await screen.findByRole("heading", { level: 1, name: "LeadFlow" });
      expect(
        document.querySelector('meta[property="og:image"]').content,
      ).toContain("/social/leadflow.png");
      await user.click(
        within(document.querySelector(".pf-site-header")).getByRole("link", {
          name: "Govind Charpe, home",
        }),
      );
      await screen.findByRole("heading", { level: 1 });
      await waitFor(() =>
        expect(document.querySelector('link[rel="canonical"]').href).toBe(
          "https://govind-charpe.netlify.app/",
        ),
      );
      expect(
        document.querySelector('meta[property="og:image"]').content,
      ).toContain("/social/portfolio.png");
      expect(
        JSON.parse(document.getElementById("page-structured-data").textContent)[
          "@graph"
        ].find((item) => item["@type"] === "ProfilePage").url,
      ).toBe("https://govind-charpe.netlify.app/");
    } finally {
      cleanup();
      document.head.innerHTML = previousHead;
    }
  });

  it("converts the navbar after 2px of scrolling without flickering or losing focus", async () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, "scrollY");
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
    try {
      renderAt("/");
      await screen.findByRole("heading", { level: 1 }, { timeout: 3000 });
      const header = screen
        .getByRole("navigation", { name: "Primary navigation" })
        .closest("header");
      const work = within(header).getByRole("link", {
        name: "Work",
        exact: true,
      });
      work.focus();
      const scroll = (position) => {
        window.scrollY = position;
        fireEvent.scroll(window);
      };
      expect(header).not.toHaveClass("is-scrolled");
      scroll(1);
      expect(header).not.toHaveClass("is-scrolled");
      scroll(2);
      expect(header).toHaveClass("is-scrolled");
      scroll(1.5);
      expect(header).toHaveClass("is-scrolled");
      scroll(1);
      expect(header).toHaveClass("is-scrolled");
      scroll(0);
      expect(header).not.toHaveClass("is-scrolled");
      scroll(60);
      expect(header).toHaveClass("is-scrolled");
      scroll(0);
      expect(header).not.toHaveClass("is-scrolled");
      expect(work).toHaveFocus();
    } finally {
      Object.defineProperty(window, "scrollY", descriptor);
    }
  });

  it("searches quick navigation and opens the selected project", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 }, { timeout: 3000 });
    await user.click(
      screen.getByRole("button", { name: "Open quick navigation" }),
    );
    const search = screen.getByRole("combobox", {
      name: "Search pages and sections",
    });
    expect(search).toHaveFocus();
    await user.type(search, "workflow");
    expect(screen.getByRole("option", { name: /LeadFlow/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.keyboard("{Enter}");
    expect(window.location.pathname).toBe("/work/leadflow");
    expect(
      await screen.findByRole(
        "heading",
        { name: "LeadFlow", level: 1 },
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/work/leadflow");
    expect(document.body).not.toHaveClass("command-is-open");
  });

  it("recovers from an empty quick-navigation search and restores focus", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const trigger = screen.getByRole("button", {
      name: "Open quick navigation",
    });
    await user.click(trigger);
    await user.type(screen.getByRole("combobox"), "unknown-destination");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(screen.getByText(/Nothing matches yet/)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Close quick navigation" }),
    );
    expect(trigger).toHaveFocus();
  });

  it("explores background notes with the keyboard", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    screen.getByRole("tab", { name: "Now", exact: true }).focus();
    await user.keyboard("{End}");
    expect(
      screen.getByRole("tab", { name: "Background", exact: true }),
    ).toHaveFocus();
    expect(
      await screen.findByText(
        "Polaris School of Technology / Medhavi Skills University",
      ),
    ).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}");
    expect(
      await screen.findByRole("heading", {
        name: "Build. Read. Review. Repeat.",
      }),
    ).toBeInTheDocument();
    await user.keyboard("{Home}");
    expect(
      await screen.findByRole("heading", { name: /AI Agent Execution/ }),
    ).toBeInTheDocument();
  });

  it("flips the personal card and keeps its note connected to the notebook", async () => {
    const user = userEvent.setup();
    renderAt("/");
    const flip = await screen.findByRole("button", {
      name: "Explore my story",
    });
    expect(flip).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("heading", { name: "Learning by building." }),
    ).not.toBeInTheDocument();
    flip.focus();
    await user.keyboard("{Enter}");
    expect(flip).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("heading", { name: "Learning by building." }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("tab", { name: "Approach", exact: true }),
    );
    expect(
      await screen.findByRole("heading", { name: "Learn from real code." }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", {
        name: "Build. Read. Review. Repeat.",
      }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("tab", { name: "Background", exact: true }),
    );
    expect(
      await screen.findByRole("heading", { name: "A work in progress." }),
    ).toBeInTheDocument();
    const back = screen.getByRole("button", { name: "Back to card" });
    back.focus();
    await user.keyboard("{Escape}");
    expect(back).toHaveFocus();
    expect(back).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByRole("heading", { name: "A work in progress." }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Background", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
  });

  it("explores real hero evidence with keyboard navigation", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const product = screen.getByRole("tab", { name: /01 Product/ });
    product.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /02 System/ })).toHaveFocus();
    expect(
      screen.getByRole("link", { name: "Explore Harbor CLI" }),
    ).toHaveAttribute("href", "/open-source?org=harbor");
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /03 Workflow/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("link", { name: "Explore LeadFlow" }),
    ).toHaveAttribute("href", "/work/leadflow");
  });

  it("reuses hero screenshots during rapid switching and exposes only the final selection", async () => {
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const panel = screen.getByRole("tabpanel", { name: /01 Product/ });
    const originalImage = within(panel).getByRole("img");
    expect(panel.querySelectorAll("img")).toHaveLength(1);
    const heroTabs = screen.getByRole("tablist", {
      name: "Explore product, system, and workflow",
    });
    fireEvent.pointerEnter(heroTabs.closest(".hero-inspector"));
    const images = [...panel.querySelectorAll("img")];
    expect(images).toHaveLength(3);
    expect(images[0]).toBe(originalImage);
    const tabs = within(heroTabs).getAllByRole("tab");
    for (let i = 0; i < 24; i++) fireEvent.click(tabs[(i + 1) % 3]);
    fireEvent.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(panel).toHaveAccessibleName(/02 System/);
    expect([...panel.querySelectorAll("img")]).toEqual(images);
    expect(within(panel).getAllByRole("img")).toHaveLength(1);
    expect(within(panel).getByRole("img")).toBe(images[1]);
    expect(
      within(panel).getByRole("link", { name: "Explore Harbor CLI" }),
    ).toHaveAttribute("href", "/open-source?org=harbor");
    expect(panel.querySelectorAll("[inert]")).toHaveLength(2);
  });

  it("finishes rapid skill-category changes on the final selection", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    await user.click(
      screen.getByRole("button", { name: "Frontend", exact: true }),
    );
    await user.click(
      screen.getByRole("button", { name: "Tools and Cloud", exact: true }),
    );
    await user.click(
      screen.getByRole("button", { name: "Backend and Data", exact: true }),
    );
    const frontend = screen.getByRole("button", {
      name: "Frontend",
      exact: true,
    });
    await user.click(frontend);
    expect(frontend).toHaveAttribute("aria-pressed", "true");
    expect(
      await screen.findByRole(
        "button",
        { name: "React", exact: true },
        { timeout: 2500 },
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "React", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Go", exact: true }),
    ).not.toBeInTheDocument();
    frontend.focus();
    await user.keyboard("{Home}");
    expect(
      screen.getByRole("button", { name: "Languages", exact: true }),
    ).toHaveFocus();
    expect(
      await screen.findByRole(
        "button",
        { name: "JavaScript", exact: true },
        { timeout: 2500 },
      ),
    ).toBeInTheDocument();
  });

  it("opens the original screenshot from a clickable workbench card", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    await user.click(
      screen.getByRole("button", { name: "Bring Harbor CLI to front" }),
    );
    expect(screen.getByRole("tab", { name: /02 System/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await user.click(
      screen.getByRole("button", { name: "Inspect image", exact: true }),
    );
    const dialog = screen.getByRole("dialog", {
      name: "Harbor CLI / original project screenshot",
    });
    expect(within(dialog).getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("harbor-gc-history-terminal"),
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Close expanded image" }),
    );
    expect(
      screen.getByRole("button", { name: "Inspect image", exact: true }),
    ).toHaveFocus();
  });

  it("resets the Lab style, pacing, stage, and view together", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    await user.click(screen.getByRole("radio", { name: "Sage" }));
    await user.click(
      screen.getByRole("button", { name: "Round", exact: true }),
    );
    fireEvent.change(screen.getByRole("slider", { name: "Step duration" }), {
      target: { value: "6" },
    });
    await user.click(screen.getByRole("tab", { name: /05 Dispatch/ }));
    expect(
      screen.getByRole("heading", { name: "Dispatch" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tabpanel", { name: /05 Dispatch/ }),
    ).toHaveTextContent("Approved route and configured destination.");
    await user.click(screen.getByRole("button", { name: "CSS", exact: true }));
    await user.click(
      screen.getByRole("button", { name: "Reset lab controls" }),
    );
    expect(screen.getByRole("radio", { name: "Coral" })).toBeChecked();
    expect(screen.getByRole("slider", { name: "Corner radius" })).toHaveValue(
      "20",
    );
    expect(screen.getByRole("slider", { name: "Step duration" })).toHaveValue(
      "3",
    );
    expect(screen.getByRole("tab", { name: /01 Intake/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Preview", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Run walkthrough" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps workflow selection and generated CSS aligned with lab controls", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const intake = screen.getByRole("tab", { name: /01 Intake/ });
    intake.focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: /05 Dispatch/ })).toHaveFocus();
    expect(
      screen.getByRole("heading", { name: "Dispatch" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Sage" }));
    const slider = screen.getByRole("slider", { name: "Corner radius" });
    fireEvent.change(slider, { target: { value: "4" } });
    await user.click(screen.getByRole("button", { name: "CSS", exact: true }));
    const spy = vi.spyOn(navigator.clipboard, "writeText");
    await user.click(screen.getByRole("button", { name: "Copy workflow CSS" }));
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("--lab-accent: #b7cb8b"),
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining(`--lab-radius: ${slider.value}px`),
    );
    expect(await screen.findByText("CSS copied.")).toBeInTheDocument();
  });

  it("provides a manual copy fallback for the lab CSS", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    await user.click(screen.getByRole("button", { name: "CSS", exact: true }));
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(
      new Error("denied"),
    );
    await user.click(screen.getByRole("button", { name: "Copy workflow CSS" }));
    expect(
      await screen.findByText(
        "Copy unavailable. Select the CSS to copy it manually.",
      ),
    ).toBeInTheDocument();
    expect(document.querySelector(".lab-code code")).toHaveTextContent(
      "--lab-accent: #f16b50",
    );
  });

  it("renders the rebuilt homepage and current project", async () => {
    renderAt("/");
    expect(
      await screen.findByRole("heading", { level: 1, name: /Govind Charpe/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Selected projects" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /AI Agent Execution/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("My current project. OpenTrack is on hold."),
    ).toBeInTheDocument();
  });

  it("finds projects by technology and recovers from combined empty filters", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const search = screen.getByRole("searchbox", { name: "Search projects" });
    await user.type(search, "n8n");
    expect(
      screen.getByRole("button", { name: "Explore LeadFlow" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.queryByRole("button", { name: "Explore GitAnalyzer" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("1 project found")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Products", exact: true }),
    );
    expect(
      screen.getByText("No project matches that combination."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Inspect screenshot" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show all projects" }));
    expect(search).toHaveValue("");
    expect(screen.getByText("2 projects found")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Explore GitAnalyzer" }),
    ).toBeInTheDocument();
  });

  it("controls screenshot inspection with keyboard and resets it on image changes", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const toggle = screen.getByRole("button", { name: "Inspect screenshot" });
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("group", { name: "Screenshot inspection area" }),
    ).toHaveFocus();
    await user.keyboard("{ArrowRight}{Escape}");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle).toHaveFocus();
    await user.click(toggle);
    await user.click(
      screen.getByRole("button", { name: "Scoring", exact: true }),
    );
    expect(
      screen.getByRole("button", { name: "Inspect screenshot" }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(document.querySelector(".screenshot-lens")).not.toBeInTheDocument();
  });

  it("renders direct case-study, open-source, resume, and 404 routes", async () => {
    let view = renderAt("/work/gitanalyzer");
    expect(
      await screen.findByRole("heading", { level: 1, name: "GitAnalyzer" }),
    ).toBeInTheDocument();
    expect(document.title).toBe("GitAnalyzer Case Study — Govind Charpe");
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
      await screen.findByRole("heading", { level: 1, name: /Govind\s*Charpe/ }),
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

  it("supports arrow-key navigation in case-study walkthrough tabs", async () => {
    const user = userEvent.setup();
    renderAt("/work/gitanalyzer");
    await screen.findByRole("heading", { level: 1, name: "GitAnalyzer" });

    const firstTab = screen.getByRole("tab", {
      name: /^01\s*Explainable scoring$/,
    });
    firstTab.focus();
    await user.keyboard("{End}");

    const lastTab = screen.getByRole("tab", {
      name: /^03\s*Diff-grounded AI assistance$/,
    });
    expect(lastTab).toHaveFocus();
    expect(lastTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowRight}");
    expect(firstTab).toHaveFocus();
    expect(firstTab).toHaveAttribute("aria-selected", "true");
  });

  it("switches projects, resets screenshots, and wraps navigation", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    await user.click(screen.getByRole("button", { name: "Scoring" }));
    expect(screen.getByRole("button", { name: "Scoring" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Next project" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "LeadFlow" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Qualification" }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: "Next project" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "GitAnalyzer" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Overview" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Previous project" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "LeadFlow" }),
    ).toBeInTheDocument();
  });

  it("opens a real project and explores skill categories", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    expect(
      screen.getByRole("link", { name: "View GitAnalyzer case study" }),
    ).toHaveAttribute("href", "/work/gitanalyzer");
    await user.click(screen.getByRole("button", { name: "Backend and Data" }));
    await user.click(
      await screen.findByRole("button", { name: "OAuth" }, { timeout: 2500 }),
    );
    expect(
      await screen.findByRole("heading", { level: 3, name: "OAuth" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Languages" }));
    expect(
      await screen.findByRole("heading", { level: 3, name: "JavaScript" }),
    ).toBeInTheDocument();
  });

  it("expands a contribution without leaving the page", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    const summary = screen
      .getByText("Safer login flag handling")
      .closest("summary");
    await user.click(summary);
    expect(summary.parentElement).toHaveAttribute("open");
    expect(
      within(summary.parentElement).getByRole("link", {
        name: "View Harbor CLI pull request #849 on GitHub",
      }),
    ).toHaveAttribute(
      "href",
      "https://github.com/goharbor/harbor-cli/pull/849",
    );
  });

  it("names each homepage pull-request link with its repository and number", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    for (const [repository, number, path] of [
      ["Harbor CLI", 849, "goharbor/harbor-cli"],
      ["Harbor CLI", 855, "goharbor/harbor-cli"],
      ["Music Blocks", 6602, "sugarlabs/musicblocks"],
      ["Music Blocks", 6316, "sugarlabs/musicblocks"],
    ]) {
      const summary = screen
        .getByText(`${repository} / #${number}`)
        .closest("summary");
      await user.click(summary);
      const link = within(summary.parentElement).getByRole("link", {
        name: `View ${repository} pull request #${number} on GitHub`,
      });
      expect(link).toHaveAttribute(
        "href",
        `https://github.com/${path}/pull/${number}`,
      );
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("keeps inactive Lab controls out of keyboard and accessibility navigation", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    expect(
      screen.queryByRole("button", { name: "Copy workflow CSS" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".lab-code")).toHaveAttribute("inert");
    await user.click(screen.getByRole("button", { name: "CSS", exact: true }));
    expect(
      screen.getByRole("button", { name: "Copy workflow CSS" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: "01 Intake" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".lab-preview")).toHaveAttribute("inert");
    await user.click(
      screen.getByRole("button", { name: "Preview", exact: true }),
    );
    expect(screen.getByRole("tab", { name: "01 Intake" })).toBeInTheDocument();
    expect(document.querySelector(".lab-preview")).not.toHaveAttribute("inert");
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

    const trigger = screen.getByRole("button", { name: "Expand screenshot" });
    expect(document.querySelectorAll("dialog img")).toHaveLength(0);
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("open");
    expect(within(dialog).getByRole("img")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("group", {
        name: "Evidence image",
        exact: true,
      }),
    ).toBeInTheDocument();

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
    expect(dialog.querySelector("img")).toBeNull();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(within(dialog).getByRole("img")).toBeInTheDocument();
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(dialog.querySelector("img")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("reports clipboard failure with a usable email fallback", async () => {
    const user = userEvent.setup();
    renderAt("/");
    await screen.findByRole("heading", { level: 1 });
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(
      new Error("denied"),
    );
    await user.click(screen.getByRole("button", { name: "Copy email" }));
    expect(
      await screen.findByRole("status", { name: "Email copy result" }),
    ).toHaveTextContent("Copy unavailable. Email: govind.charpe16@gmail.com");
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

import { assets, musicBlocksVideo } from "./assets";

export const links = {
  github: "https://github.com/gcharpe1604",
  linkedIn: "https://www.linkedin.com/in/govind-charpe",
  twitter: "https://x.com/g_charpe16",
  email: "govind.charpe16@gmail.com",
  gitAnalyzerSource: "https://github.com/gcharpe1604/gitanalyzer",
  gitAnalyzerLive: "https://gitanalyzer-ai.netlify.app/",
  leadFlowSource: "https://github.com/gcharpe1604/ai-lead-qualification-agent",
  resume: "/resume",
};

export const site = {
  name: "Govind Charpe",
  monogram: "GC",
  eyebrow: "Software Engineering Student · Open-Source Contributor",
  headline:
    "I build software products and contribute to real open-source systems.",
  introduction:
    "I’m Govind Charpe, a software engineering student focused on backend, full-stack, and cloud-native systems. I build developer tools and automation, with reviewed contributions to CNCF Harbor CLI and Sugar Labs Music Blocks.",
  availability:
    "Open to software engineering internships and meaningful open-source collaborations.",
  location: "Bengaluru, India · Open to remote opportunities",
};

export const stats = [
  { value: "11", label: "Merged open-source PRs" },
  { value: "2", label: "Established open-source organizations" },
  { value: "2", label: "Featured engineering systems" },
];

export const projects = {
  gitAnalyzer: {
    slug: "gitanalyzer",
    label: "Developer Tool · Featured Project",
    title: "GitAnalyzer",
    status: "Live product",
    description:
      "A developer-feedback platform that analyzes GitHub commit histories, identifies recurring quality problems and provides repository-specific recommendations.",
    summary:
      "I built an explainable rule-based scoring engine, repository-level analysis, authenticated history, PDF reports and diff-grounded AI commit suggestions.",
    outcome:
      "An explainable developer-feedback product that turns recent repository history into scoring, patterns, and practical recommendations.",
    highlights: [
      "Analyzes up to 100 recent commits.",
      "Separates clarity, structure and consistency scores.",
      "Produces recommendations from detected repository patterns.",
      "Supports GitHub and Google authentication.",
      "Provides 15 monthly AI suggestions with personal-key fallback.",
      "Stores authenticated analysis history in Supabase.",
    ],
    stack: [
      "React",
      "TypeScript",
      "GitHub API",
      "Supabase",
      "Netlify Functions",
    ],
    image: assets.gitAnalyzerDashboard,
    links: {
      caseStudy: "/work/gitanalyzer",
      live: links.gitAnalyzerLive,
      source: links.gitAnalyzerSource,
    },
  },
  leadFlow: {
    slug: "leadflow",
    label: "Automation System · Working Demo",
    title: "LeadFlow",
    status: "Working demo",
    description:
      "A configurable lead qualification and routing system that turns inbound lead data into validated, explainable and auditable outcomes.",
    summary:
      "I designed a canonical lead model, deterministic and AI-assisted qualification modes, failure policies, manual-review boundaries, configurable routing and dispatcher integrations.",
    outcome:
      "A working orchestration demo that makes qualification, policy, and routing decisions visible rather than hiding them behind a single AI response.",
    highlights: [
      "Input validation and normalization.",
      "Company-context enrichment.",
      "Rules-only, AI-only and hybrid qualification.",
      "Fallback-to-rules policy.",
      "Qualified, nurture and disqualified routing.",
      "Webhook and notification dispatchers.",
      "Audit-friendly orchestration results.",
    ],
    stack: [
      "n8n",
      "JavaScript",
      "Webhooks",
      "OpenRouter",
      "Configuration-driven workflows",
    ],
    image: assets.leadFlowQualification,
    links: {
      caseStudy: "/work/leadflow",
      source: links.leadFlowSource,
    },
  },
};

export const gitAnalyzerDetails = [
  {
    id: "scoring",
    label: "Explainable scoring",
    summary:
      "Clarity, structure, and consistency stay visible as separate signals instead of collapsing into an opaque score.",
    asset: assets.gitAnalyzerScoring,
  },
  {
    id: "recommendations",
    label: "Repository-specific recommendations",
    summary:
      "Detected commit patterns become focused guidance tied to the repository being analyzed.",
    asset: assets.gitAnalyzerRecommendations,
  },
  {
    id: "ai",
    label: "Diff-grounded AI assistance",
    summary:
      "Optional AI suggestions use the visible code change as context; the core analysis remains deterministic.",
    asset: assets.gitAnalyzerAiSuggestion,
  },
];

export const leadFlowStages = [
  {
    id: "intake",
    label: "Intake",
    detail: "Accept a lead payload and validate required inputs.",
  },
  {
    id: "normalize",
    label: "Normalize / Enrich",
    detail: "Map data into a canonical model and add company context.",
  },
  {
    id: "qualify",
    label: "Qualify",
    detail: "Run rules-only, AI-only, or hybrid qualification.",
  },
  {
    id: "route",
    label: "Review / Route",
    detail: "Apply explicit confidence, fallback, and review boundaries.",
  },
  {
    id: "dispatch",
    label: "Dispatch",
    detail: "Build a destination plan for webhook or notification dispatchers.",
  },
];

export const openSourceIntro = {
  heading: "Engineering in codebases I didn’t design",
  copy: "Open source has taught me how to understand unfamiliar systems, work within existing conventions, respond to technical review and make changes that maintainers can confidently integrate.",
};

const pr = (organization, number) =>
  `https://github.com/${organization}/pull/${number}`;

export const organizations = {
  harbor: {
    id: "harbor",
    name: "Harbor CLI",
    repository: "goharbor/harbor-cli",
    intro:
      "I contribute to Harbor CLI, a Go-based command-line interface in the CNCF Harbor ecosystem, working on command behaviour, error propagation, validation and system-management functionality.",
  },
  musicblocks: {
    id: "musicblocks",
    name: "Music Blocks",
    repository: "sugarlabs/musicblocks",
    intro:
      "I contributed reliability, performance, interaction and tooling improvements to Music Blocks, a large JavaScript application for learning programming through music.",
  },
};

export const contributions = [
  {
    organization: "harbor",
    number: 1030,
    date: "2026-06-30",
    title: "Garbage-collection history command",
    status: "In review",
    statusKey: "review",
    description:
      "Added API integration, pagination, validation, Bubble Tea table rendering, focused tests, and generated documentation.",
    technologies: ["Go", "Cobra", "Harbor SDK", "Bubble Tea"],
    link: pr("goharbor/harbor-cli", 1030),
    asset: assets.harborTerminal,
    featured: true,
  },
  {
    organization: "harbor",
    number: 932,
    date: "2026-05-15",
    title: "Replication prompt error propagation",
    status: "In review",
    statusKey: "review",
    description:
      "Propagates interactive prompt and selection errors through Cobra instead of terminating the process abruptly. The current review requests focused error-path tests and narrower concurrency changes.",
    technologies: ["Go", "Cobra", "Error handling"],
    link: pr("goharbor/harbor-cli", 932),
  },
  {
    organization: "harbor",
    number: 930,
    date: "2026-05-15",
    title: "Improved CLI error propagation",
    status: "Approved · Awaiting merge",
    statusKey: "approved",
    description:
      "Corrected configuration and context-switch error propagation so automation receives meaningful exit behaviour.",
    technologies: ["Go", "Cobra", "CLI behaviour"],
    link: pr("goharbor/harbor-cli", 930),
    asset: assets.harborReview,
    featured: true,
  },
  {
    organization: "harbor",
    number: 897,
    date: "2026-05-08",
    title: "Precompiled validation regular expressions",
    status: "Approved · Awaiting merge",
    statusKey: "approved",
    description:
      "Moved validation expressions to package scope while preserving existing validation behaviour.",
    technologies: ["Go", "Validation"],
    link: pr("goharbor/harbor-cli", 897),
  },
  {
    organization: "harbor",
    number: 855,
    date: "2026-05-02",
    title: "Improved password security guidance",
    status: "Merged",
    statusKey: "merged",
    description:
      "Updated login flag help and generated documentation to steer users toward password-stdin.",
    technologies: ["Go", "Cobra", "Documentation"],
    link: pr("goharbor/harbor-cli", 855),
  },
  {
    organization: "harbor",
    number: 849,
    date: "2026-05-01",
    title: "Safer login flag handling",
    status: "Merged",
    statusKey: "merged",
    description:
      "Prevented incompatible password flags from being supplied together using Cobra’s built-in mutual-exclusion validation.",
    technologies: ["Go", "Cobra", "Tests"],
    link: pr("goharbor/harbor-cli", 849),
    asset: assets.harborLoginDiff,
    featured: true,
  },
  {
    organization: "musicblocks",
    number: 6938,
    date: "2026-04-26",
    title: "Correct rational duration summing",
    status: "Merged",
    statusKey: "merged",
    description:
      "Removed an invalid comparison between rational duration arrays and a primitive number.",
    technologies: ["JavaScript", "Music logic"],
    link: pr("sugarlabs/musicblocks", 6938),
  },
  {
    organization: "musicblocks",
    number: 6615,
    date: "2026-04-14",
    title: "Reduced redundant canvas redraws",
    status: "Merged",
    statusKey: "merged",
    description:
      "Replaced immediate redraw calls with the existing deferred stage-dirty rendering path.",
    technologies: ["JavaScript", "Canvas", "Rendering"],
    link: pr("sugarlabs/musicblocks", 6615),
  },
  {
    organization: "musicblocks",
    number: 6602,
    date: "2026-04-14",
    title: "Standardized application error handling",
    status: "Merged",
    statusKey: "merged",
    description:
      "Replaced primitive string exceptions with standard Error objects and updated affected tests.",
    technologies: ["JavaScript", "Error handling", "Tests"],
    link: pr("sugarlabs/musicblocks", 6602),
    asset: assets.musicBlocksDiff,
    featured: true,
  },
  {
    organization: "musicblocks",
    number: 6595,
    date: "2026-04-14",
    title: "Resolved asynchronous project loading",
    status: "Merged",
    statusKey: "merged",
    description:
      "Awaited asynchronous project data before loading it and corrected a related storage reference.",
    technologies: ["JavaScript", "Async state"],
    link: pr("sugarlabs/musicblocks", 6595),
  },
  {
    organization: "musicblocks",
    number: 6581,
    date: "2026-04-13",
    title: "Released webcam hardware correctly",
    status: "Merged",
    statusKey: "merged",
    description:
      "Stopped active MediaStream tracks, cleared the video source, and reset camera state.",
    technologies: ["JavaScript", "MediaStream"],
    link: pr("sugarlabs/musicblocks", 6581),
  },
  {
    organization: "musicblocks",
    number: 6367,
    date: "2026-03-23",
    title: "Prevented translation startup race",
    status: "Merged",
    statusKey: "merged",
    description:
      "Adjusted loading order and added a defensive fallback for the translation function.",
    technologies: ["JavaScript", "Startup reliability"],
    link: pr("sugarlabs/musicblocks", 6367),
  },
  {
    organization: "musicblocks",
    number: 6316,
    date: "2026-03-19",
    title: "Added block-connection feedback",
    status: "Merged",
    statusKey: "merged",
    description:
      "Added brief visual feedback after compatible blocks connect, making successful drag-and-drop interactions easier to understand.",
    technologies: ["JavaScript", "Interaction"],
    link: pr("sugarlabs/musicblocks", 6316),
    video: musicBlocksVideo,
    featured: true,
  },
  {
    organization: "musicblocks",
    number: 6301,
    date: "2026-03-19",
    title: "Improved Planet error logging",
    status: "Merged",
    statusKey: "merged",
    description:
      "Replaced generic console logging with warning and error levels in Planet workflows.",
    technologies: ["JavaScript", "Diagnostics"],
    link: pr("sugarlabs/musicblocks", 6301),
  },
  {
    organization: "musicblocks",
    number: 6291,
    date: "2026-03-19",
    title: "Added a generated PDF programming guide",
    status: "Merged",
    statusKey: "merged",
    description:
      "Added a downloadable guide, generation tooling, and supporting documentation interface updates.",
    technologies: ["JavaScript", "PDF", "Documentation"],
    link: pr("sugarlabs/musicblocks", 6291),
  },
];

export const capabilities = [
  {
    title: "Backend and APIs",
    description:
      "REST APIs, authentication, validation, error handling, webhooks, and configuration-driven logic.",
    technologies: ["REST", "OAuth", "Validation", "Webhooks"],
    evidence: [
      { label: "LeadFlow", href: "/work/leadflow" },
      { label: "GitAnalyzer", href: "/work/gitanalyzer" },
    ],
  },
  {
    title: "Data and persistence",
    description: "Persistent application state and hosted data services.",
    technologies: ["Supabase", "PostgreSQL", "History"],
    evidence: [
      { label: "GitAnalyzer", href: "/work/gitanalyzer" },
      { label: "OpenTrack · Under development", href: "#about" },
    ],
  },
  {
    title: "Frontend product engineering",
    description:
      "Responsive interfaces, API-driven dashboards, and reusable interaction systems.",
    technologies: ["React", "TypeScript", "Canvas"],
    evidence: [
      { label: "GitAnalyzer", href: "/work/gitanalyzer" },
      { label: "Music Blocks", href: "/open-source?org=musicblocks" },
    ],
  },
  {
    title: "Open-source and cloud-native development",
    description:
      "Established repositories, CLI conventions, tests, review feedback, and container-oriented tooling.",
    technologies: ["Go", "Cobra", "Git", "Docker"],
    evidence: [
      { label: "Harbor CLI", href: "/open-source?org=harbor" },
      { label: "Cloud deployment work", href: "#about" },
    ],
  },
];

export const about = {
  paragraphs: [
    "I’m a second-year computer science student at Polaris School of Technology in Bengaluru. I started by building frontend applications and gradually moved toward backend systems, APIs, developer tooling and cloud-native engineering.",
    "Building my own projects taught me how to turn ideas into working software. Open-source contribution taught me something different: how to navigate unfamiliar codebases, understand existing design decisions, respond to review and make changes that fit a system other people maintain.",
    "I’m currently deepening my understanding of Go, backend engineering, databases, Docker and distributed systems. My long-term direction is toward backend and cloud-native engineering, while continuing to build complete products across the stack.",
  ],
  focus: [
    "Learning Go through practical exercises.",
    "Contributing to CNCF Harbor CLI.",
    "Improving backend and distributed-systems fundamentals.",
    "Building stronger production-ready project case studies.",
    "Building OpenTrack.",
  ],
  education: [
    "B.Tech in Computer Science and Engineering — AI & ML",
    "Polaris School of Technology / Medhavi Skills University",
    "Bengaluru · 2025–2029",
  ],
  openTrack:
    "OpenTrack — A GitHub-linked contribution-tracking platform currently under development.",
};

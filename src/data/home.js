import { assets, musicBlocksVideo } from "./assets";
import { contributions, links, projects } from "./site";

const contributionByNumber = (number) =>
  contributions.find((contribution) => contribution.number === number);

export const proofRecords = [
  {
    id: "product",
    label: "Product",
    title: "GitAnalyzer",
    claim: "I turn repository history into explainable developer feedback.",
    artifact: "Live product interface",
    validation:
      "A working report flow with transparent scoring, repository-specific guidance, and diff-grounded suggestions.",
    asset: assets.gitAnalyzerDashboard,
    href: projects.gitAnalyzer.links.caseStudy,
  },
  {
    id: "terminal",
    label: "System",
    title: "Harbor CLI",
    claim: "I implement system behaviour inside codebases I did not design.",
    artifact: "Garbage-collection history command",
    validation: `${contributionByNumber(1030).status} as PR #1030, with API integration, pagination, validation, table output, tests, and docs.`,
    asset: assets.harborTerminal,
    href: "/open-source?org=harbor",
  },
  {
    id: "review",
    label: "Review",
    title: "Maintainer validation",
    claim:
      "I work through technical review and preserve repository conventions.",
    artifact: "Harbor CLI review evidence",
    validation: `${contributionByNumber(930).status} after correcting configuration and context-switch error propagation.`,
    asset: assets.harborReview,
    href: "/open-source?org=harbor",
  },
];

export const projectFeatures = [
  {
    id: "overview",
    label: "Product overview",
    asset: assets.gitAnalyzerDashboard,
    claim:
      "One report turns recent Git history into a readable account of commit quality.",
    decision:
      "Keep the primary analysis deterministic and make every scoring dimension visible.",
    result:
      "A live product with repository reports, authenticated history, and exportable feedback.",
  },
  {
    id: "scoring",
    label: "Explainable scoring",
    asset: assets.gitAnalyzerScoring,
    claim: "A useful score should explain which behaviours produced it.",
    decision:
      "Separate clarity, structure, and consistency instead of collapsing them into an opaque grade.",
    result:
      "Reviewers can inspect the component signals and quality distribution behind the summary score.",
  },
  {
    id: "recommendations",
    label: "Repository-specific recommendations",
    asset: assets.gitAnalyzerRecommendations,
    claim:
      "Generic advice is weaker than feedback tied to patterns in the repository being analyzed.",
    decision:
      "Generate guidance from detected commit-history patterns and keep the supporting reason visible.",
    result:
      "Recommendations stay specific to the analyzed repository; they are guidance, not a correctness guarantee.",
  },
  {
    id: "ai",
    label: "Diff-grounded AI suggestion",
    asset: assets.gitAnalyzerAiSuggestion,
    claim:
      "Optional AI assistance should be grounded in the code change the developer can inspect.",
    decision:
      "Send the visible diff as context and keep deterministic analysis available without AI.",
    result:
      "The feature offers a practical suggestion with a monthly allowance and personal-key fallback.",
  },
];

export const pipelineStages = [
  {
    id: "intake",
    label: "Intake",
    input: "Inbound lead payload from a form, webhook, or test fixture.",
    decision: "Validate required fields before orchestration continues.",
    output: "A traceable request with an explicit workflow entry point.",
    boundary:
      "Invalid input stops early with a structured failure instead of leaking into later stages.",
    asset: assets.leadFlowWorkflow,
  },
  {
    id: "normalize",
    label: "Normalize and enrich",
    input: "Provider-shaped fields and optional company context.",
    decision:
      "Map fields into one canonical lead model, then enrich when context is available.",
    output: "Consistent lead and company objects for downstream policies.",
    boundary:
      "Missing enrichment does not silently become fabricated context; the workflow keeps the limitation visible.",
    asset: assets.leadFlowWorkflow,
  },
  {
    id: "qualify",
    label: "Qualify",
    input: "Normalized lead data, qualification mode, and versioned rules.",
    decision:
      "Run rules-only, AI-only, or hybrid qualification with explicit reasons.",
    output: "Score, confidence, outcome, and the reasons behind the decision.",
    boundary:
      "Hybrid mode can fall back to deterministic rules when the AI path is unavailable.",
    asset: assets.leadFlowQualification,
  },
  {
    id: "route",
    label: "Review and route",
    input: "Qualification result, confidence, and routing policy.",
    decision:
      "Apply manual-review boundaries before choosing qualified, nurture, or disqualified paths.",
    output: "A visible route with priority and destination intent.",
    boundary:
      "Low-confidence or policy-sensitive cases remain reviewable instead of being dispatched blindly.",
    asset: assets.leadFlowPolicy,
  },
  {
    id: "dispatch",
    label: "Dispatch",
    input: "Approved route and configured destination.",
    decision: "Build an adapter-ready webhook or notification plan.",
    output: "An auditable dispatch plan for the selected destination.",
    boundary:
      "The current project demonstrates orchestration and dispatcher planning; provider delivery still requires real configuration and runtime validation.",
    asset: assets.leadFlowRouting,
  },
];

const skill = (name, context, depth, href) => ({
  name,
  context,
  depth,
  href,
});

export const skillGroups = [
  {
    id: "languages",
    label: "Languages",
    skills: [
      skill(
        "JavaScript",
        "Used across LeadFlow orchestration and merged Music Blocks reliability and interaction changes.",
        "Applied in projects and open source",
        "/open-source?org=musicblocks",
      ),
      skill(
        "TypeScript",
        "Primary application language for GitAnalyzer’s interface and analysis flows.",
        "Applied in a live product",
        projects.gitAnalyzer.links.caseStudy,
      ),
      skill(
        "Python",
        "Used for coursework and utility scripting; it has less public portfolio evidence than JavaScript or TypeScript.",
        "Foundational project use",
      ),
      skill(
        "Go",
        "Growing proficiency supported by Harbor CLI command, validation, error-handling, and test contributions.",
        "Growing through reviewed open source",
        "/open-source?org=harbor",
      ),
      skill(
        "SQL",
        "Used with PostgreSQL-backed application data and current OpenTrack development work.",
        "Applied in product data flows",
        projects.gitAnalyzer.links.caseStudy,
      ),
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      skill(
        "React",
        "Used to build GitAnalyzer, this portfolio, and reusable evidence-driven interfaces.",
        "Applied in live interfaces",
        projects.gitAnalyzer.links.live,
      ),
      skill(
        "Vite",
        "Used for fast React development and production bundling in GitAnalyzer and this portfolio.",
        "Applied in shipped projects",
        projects.gitAnalyzer.links.caseStudy,
      ),
      skill(
        "HTML",
        "Semantic structure, accessible controls, document hierarchy, and resilient content.",
        "Applied across interfaces",
      ),
      skill(
        "CSS",
        "Responsive layout, theming, typography, media presentation, and interaction states.",
        "Applied across interfaces",
      ),
      skill(
        "Responsive interfaces",
        "Built and checked across desktop, tablet, and small-mobile layouts without hover-only content.",
        "Applied and browser-verified",
      ),
    ],
  },
  {
    id: "backend-data",
    label: "Backend and Data",
    skills: [
      skill(
        "Node.js",
        "Used in server-side project workflows, integrations, and development tooling.",
        "Applied in project backends",
        projects.leadFlow.links.caseStudy,
      ),
      skill(
        "Express",
        "Used in API-focused project work; current public case studies lean more heavily on functions and workflow orchestration.",
        "Foundational project use",
      ),
      skill(
        "REST APIs",
        "Integrated GitHub, authentication, webhook, and Harbor API flows with explicit failure handling.",
        "Applied across products and open source",
        projects.gitAnalyzer.links.caseStudy,
      ),
      skill(
        "PostgreSQL",
        "Used through Supabase for GitAnalyzer history and in OpenTrack architecture and development work.",
        "Applied; OpenTrack remains under development",
        projects.gitAnalyzer.links.caseStudy,
      ),
      skill(
        "MongoDB",
        "Used in earlier project work; the strongest current persistence evidence is PostgreSQL-backed.",
        "Foundational project use",
      ),
      skill(
        "OAuth",
        "Used for GitHub and Google authentication in GitAnalyzer.",
        "Applied in a live product",
        projects.gitAnalyzer.links.caseStudy,
      ),
    ],
  },
  {
    id: "tools-cloud",
    label: "Tools and Cloud",
    skills: [
      skill(
        "Git",
        "Used daily for focused changes, history inspection, review updates, and contribution workflows.",
        "Applied across all work",
        "/open-source",
      ),
      skill(
        "GitHub",
        "Product integration in GitAnalyzer and the collaboration surface for reviewed upstream work.",
        "Applied across products and open source",
        "/open-source",
      ),
      skill(
        "Docker",
        "Part of current backend and cloud-native learning, with practical local environment work.",
        "Growing proficiency",
      ),
      skill(
        "Linux",
        "Used for development environments, CLI workflows, and cloud-native fundamentals.",
        "Practical working knowledge",
      ),
      skill(
        "Postman",
        "Used to inspect and validate API requests and responses during project development.",
        "Practical API testing",
      ),
      skill(
        "CI/CD fundamentals",
        "Used through repository checks, build pipelines, and deployment-oriented project workflows.",
        "Growing through practice",
        "/open-source",
      ),
    ],
  },
];

export const contributionEvidence = {
  harbor: [849, 930, 1030].map(contributionByNumber),
  musicblocks: [6602, 6316].map(contributionByNumber),
};

export const engineeringPrinciples = [
  {
    id: "reliability",
    label: "Reliability and failure handling",
    statement:
      "Make failure explicit, preserve useful error identity, and test the path users feel when something goes wrong.",
    detail:
      "My Music Blocks and Harbor CLI work includes standardizing thrown errors, propagating command failures, validating incompatible inputs, and keeping automation-facing exit behaviour meaningful.",
    artifact: assets.musicBlocksDiff,
    artifactLabel: "Standard Error objects and updated tests in Music Blocks",
    links: [
      {
        label: "Music Blocks evidence",
        href: "/open-source?org=musicblocks",
      },
      { label: "Harbor CLI evidence", href: "/open-source?org=harbor" },
    ],
  },
  {
    id: "data-flow",
    label: "API and data-flow design",
    statement:
      "Keep transformations, decisions, and provider boundaries visible enough to debug.",
    detail:
      "LeadFlow uses a canonical model, versioned policy, explicit qualification reasons, manual-review boundaries, and adapter-ready dispatch plans rather than one opaque AI response.",
    artifact: assets.leadFlowRouting,
    artifactLabel: "LeadFlow routing and dispatch plan",
    links: [
      { label: "LeadFlow case study", href: projects.leadFlow.links.caseStudy },
      {
        label: "GitAnalyzer case study",
        href: projects.gitAnalyzer.links.caseStudy,
      },
    ],
  },
  {
    id: "collaboration",
    label: "Open-source collaboration",
    statement:
      "Understand the system first, make the smallest complete change, and treat review as engineering input.",
    detail:
      "Contributing to Harbor CLI and Music Blocks means working inside existing architecture, adding focused tests, responding to maintainers, and keeping claims tied to observable pull-request state.",
    artifact: assets.harborReview,
    artifactLabel: "Maintainer approval evidence for Harbor CLI PR #930",
    links: [
      { label: "Contribution ledger", href: "/open-source" },
      {
        label: "GitHub profile",
        href: links.github,
        external: true,
      },
    ],
  },
];

export const aboutRail = [
  {
    label: "Current",
    value: "Harbor CLI contributions and stronger backend fundamentals",
  },
  {
    label: "Learning",
    value: "Go, databases, Docker, and distributed systems",
  },
  {
    label: "Building",
    value: "OpenTrack — under development",
  },
];

export { musicBlocksVideo };

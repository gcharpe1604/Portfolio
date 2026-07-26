import { assets } from "./assets";
import { gitAnalyzerDetails, leadFlowStages, links, projects } from "./site";

export const caseStudies = {
  gitanalyzer: {
    ...projects.gitAnalyzer,
    breadcrumb: "Selected work / GitAnalyzer",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          "GitAnalyzer turns recent GitHub commit history into an explainable repository report. It separates quality dimensions, surfaces recurring patterns, and gives maintainers and contributors a practical next action.",
          "The product keeps the core analysis deterministic. AI is an optional assistance layer for commit-message improvement, not the authority behind the score.",
        ],
        facts: [
          ["Role", "Product design and full-stack implementation"],
          ["System", "Developer-feedback platform"],
          ["Core boundary", "Deterministic analysis · Optional AI assistance"],
        ],
      },
      {
        id: "problem",
        title: "Problem",
        body: [
          "A commit history contains useful signals about how a repository is maintained, but raw logs make repeated quality problems difficult to see. Generic advice is also easy to ignore when it is not tied to the repository in front of the developer.",
          "GitAnalyzer makes those signals legible without pretending that one score captures software quality as a whole.",
        ],
      },
      {
        id: "users",
        title: "Intended users",
        body: [
          "The primary users are developers reviewing their own commit habits, contributors learning a repository’s conventions, and maintainers who want a quick view of recurring commit-message patterns.",
        ],
        list: [
          "A developer preparing a cleaner project history.",
          "A new contributor learning how a repository communicates change.",
          "A maintainer looking for repeated clarity, structure, or consistency problems.",
        ],
      },
      {
        id: "walkthrough",
        title: "Product walkthrough",
        body: [
          "Three connected views move from diagnosis to action: the scoring model explains the report, deterministic recommendations connect patterns to changes, and optional AI assistance works from a specific diff.",
        ],
        walkthrough: gitAnalyzerDetails,
      },
      {
        id: "built",
        title: "What I built",
        body: [
          "I implemented the analysis experience across repository input, API orchestration, scoring, recommendations, authenticated history, PDF reporting, and the optional AI suggestion path.",
        ],
        responsibilities: [
          ["Analysis", "Rule-based scoring across recent commit history"],
          ["Product", "Report, recommendations, history, and PDF workflows"],
          ["Identity", "GitHub and Google authentication"],
          ["Persistence", "Authenticated analysis history in Supabase"],
          [
            "AI boundary",
            "Diff-grounded suggestions with usage allowance and personal-key fallback",
          ],
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        body: [
          "The architecture deliberately separates reproducible analysis from optional generation. GitHub data enters a deterministic engine; repository patterns feed recommendations; authentication and history preserve reports; the AI path is invoked only for a selected diff.",
        ],
        architecture: {
          label:
            "GitHub API data flows into deterministic scoring and recommendations, with separate authentication/history storage and an optional AI suggestion branch.",
          nodes: [
            {
              id: "github",
              label: "GitHub API",
              detail: "Fetches repository and recent commit data for analysis.",
            },
            {
              id: "analysis",
              label: "Analysis engine",
              detail:
                "Calculates explainable clarity, structure, and consistency signals.",
            },
            {
              id: "recommendations",
              label: "Recommendation layer",
              detail:
                "Maps detected repository patterns to deterministic guidance.",
            },
            {
              id: "history",
              label: "Auth / history",
              detail:
                "Stores authenticated reports and supports GitHub and Google sign-in.",
            },
            {
              id: "ai",
              label: "Optional AI path",
              detail:
                "Uses a selected code diff to propose a clearer commit message without changing the score.",
              optional: true,
            },
          ],
        },
      },
      {
        id: "decisions",
        title: "Important decisions",
        decisions: [
          {
            context:
              "A single opaque score would be difficult to trust or improve against.",
            choice:
              "Expose clarity, structure, and consistency as separate signals.",
            tradeoff:
              "The report takes more space, but the user can see why the summary changed.",
          },
          {
            context:
              "Generative output can vary and should not determine the core report.",
            choice:
              "Keep analysis and recommendations deterministic; make AI assistance optional and diff-grounded.",
            tradeoff:
              "The product has two related paths to explain, but the score remains reproducible.",
          },
          {
            context:
              "Signed-in users need continuity while anonymous exploration should remain lightweight.",
            choice:
              "Store authenticated analysis history in Supabase and leave the public analysis flow focused.",
            tradeoff:
              "Authentication and persistence add operational complexity in exchange for useful history.",
          },
        ],
      },
      {
        id: "reliability",
        title: "Reliability and testing",
        body: [
          "The analysis path accounts for GitHub API loading and error states, limits the commit window, and keeps deterministic scoring independent from AI availability. Authenticated history and personal-key fallback reduce the number of dead ends in the product flow.",
          "The most important regression boundary is the separation between analysis data and optional generation: a provider failure must not invalidate an otherwise complete repository report.",
        ],
        list: [
          "Bounded recent-commit analysis.",
          "Explicit loading and API error states.",
          "Personal-key fallback after the monthly AI allowance.",
          "Persisted report history for authenticated users.",
        ],
      },
      {
        id: "challenges",
        title: "Challenges and trade-offs",
        body: [
          "Commit quality is contextual. The design therefore presents a useful heuristic rather than claiming an objective measure of engineering quality. Repository-level pattern detection is stronger when it stays explainable, but that also limits how much nuance a rules-only model can capture.",
        ],
      },
      {
        id: "limitations",
        title: "Current limitations",
        list: [
          "The analysis is bounded to recent commit history rather than a repository’s full evolution.",
          "Commit-message heuristics cannot measure code correctness or business impact.",
          "AI suggestions depend on provider availability or a configured personal key.",
          "The scoring model will need continued calibration across different repository conventions.",
        ],
      },
      {
        id: "improvements",
        title: "Next improvements",
        list: [
          "Add clearer repository-specific baseline comparisons.",
          "Expand regression coverage around large and unusual histories.",
          "Make scoring rules easier to inspect at the individual-commit level.",
          "Improve report export and shareable analysis states.",
        ],
      },
      {
        id: "actions",
        title: "Explore the product",
        actions: [
          { label: "Open live product", href: links.gitAnalyzerLive },
          { label: "View source code", href: links.gitAnalyzerSource },
        ],
      },
    ],
    heroAsset: assets.gitAnalyzerDashboard,
  },
  leadflow: {
    ...projects.leadFlow,
    breadcrumb: "Selected work / LeadFlow",
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: [
          "LeadFlow is a working orchestration demo for turning inconsistent inbound lead data into a validated and explainable outcome. It makes mode selection, confidence, fallback policy, routing, and dispatch planning visible.",
          "It is not presented as a production SaaS or a source of measured business impact.",
        ],
        facts: [
          ["Role", "System design and workflow implementation"],
          ["System", "Qualification and routing orchestration"],
          ["Launch state", "Working demo"],
        ],
      },
      {
        id: "problem",
        title: "Problem",
        body: [
          "Lead automation becomes difficult to trust when input shape, qualification logic, confidence boundaries, and delivery decisions are hidden inside one workflow. Failures can become silent and a score can be mistaken for an explanation.",
          "LeadFlow treats each boundary as a visible system decision rather than a single black-box output.",
        ],
      },
      {
        id: "users",
        title: "Intended users",
        body: [
          "The system is designed as an engineering demo for teams evaluating how to structure qualification and routing automation before operational deployment.",
        ],
        list: [
          "An operator reviewing why a lead received a particular outcome.",
          "An engineer configuring qualification modes and failure policy.",
          "A team separating routing intent from actual dispatcher delivery.",
        ],
      },
      {
        id: "walkthrough",
        title: "System walkthrough",
        body: [
          "The native diagram explains the five-stage mental model. The full n8n canvas then provides implementation evidence, followed by three carefully distinguished outputs: an executed sample qualification, a routing plan, and a configured reliability policy.",
        ],
        diagram: leadFlowStages,
        media: [
          {
            title: "Complete orchestration",
            caption:
              "The real n8n workflow shows the orchestration and its explicit failure branches.",
            asset: assets.leadFlowWorkflow,
          },
          {
            title: "Explainable qualification",
            caption:
              "Sample qualified result with score, confidence and explicit reasons.",
            asset: assets.leadFlowQualification,
          },
          {
            title: "Routing plan",
            caption:
              "A qualified result is converted into an explicit priority route and destination plan.",
            asset: assets.leadFlowRouting,
          },
          {
            title: "Reliability policy",
            caption:
              "Hybrid qualification policy with versioned rules and a fallback-to-rules failure policy.",
            asset: assets.leadFlowPolicy,
          },
        ],
      },
      {
        id: "built",
        title: "What I built",
        body: [
          "I designed the canonical lead model, validation and normalization boundaries, company-context enrichment, qualification modes, policy configuration, routing states, dispatcher interfaces, and audit-oriented result shape.",
        ],
        responsibilities: [
          ["Input", "Validation, normalization, and canonical lead shape"],
          ["Context", "Company enrichment boundary"],
          ["Decision", "Rules-only, AI-only, and hybrid qualification"],
          ["Safety", "Fallback-to-rules and manual-review boundaries"],
          ["Routing", "Qualified, nurture, and disqualified outcomes"],
          ["Dispatch", "Webhook and notification destination planning"],
        ],
      },
      {
        id: "architecture",
        title: "Architecture",
        body: [
          "The orchestrator advances through explicit stages and returns structured state at each boundary. Error handlers feed a visible policy decision instead of silently converting an exception into a normal outcome.",
        ],
        architecture: {
          label:
            "Lead data moves through intake, normalization and enrichment, qualification, review and routing, then dispatch planning; failure policy can redirect qualification to rules.",
          nodes: leadFlowStages.map((stage) => ({
            id: stage.id,
            label: stage.label,
            detail: stage.detail,
          })),
        },
      },
      {
        id: "decisions",
        title: "Important decisions",
        decisions: [
          {
            context:
              "Inbound lead payloads are inconsistent and downstream logic needs one stable shape.",
            choice:
              "Normalize into a canonical lead model before enrichment and qualification.",
            tradeoff:
              "The intake layer does more work, but later stages are simpler and more auditable.",
          },
          {
            context:
              "Teams may need deterministic decisions, AI assistance, or a controlled combination.",
            choice:
              "Make rules-only, AI-only, and hybrid modes explicit configuration.",
            tradeoff:
              "Configuration requires careful validation, but the decision boundary stays visible.",
          },
          {
            context:
              "A planned route is not proof that an external webhook accepted delivery.",
            choice:
              "Represent routing and dispatcher destinations as an explicit plan.",
            tradeoff:
              "Operational delivery needs separate evidence, but the workflow avoids overstating success.",
          },
        ],
      },
      {
        id: "reliability",
        title: "Reliability and testing",
        body: [
          "The workflow validates inputs, checks stage results, builds failure outputs, and makes the configured fallback policy visible. The supplied policy evidence shows configuration—not a recorded AI failure or a demonstrated manual-review event.",
          "A production deployment would additionally need delivery receipts, secrets management, retries, monitoring, and a broader automated workflow test harness.",
        ],
        list: [
          "Input validation and normalization.",
          "Explicit failure branches between stages.",
          "Versioned rules and fallback policy.",
          "Audit-friendly structured orchestration results.",
        ],
      },
      {
        id: "challenges",
        title: "Challenges and trade-offs",
        body: [
          "The main design challenge is separating decision quality from system reliability. A confident qualification does not prove that enrichment was complete, and a routing plan does not prove delivery. The case study therefore labels each artifact by what it actually demonstrates.",
        ],
      },
      {
        id: "limitations",
        title: "Current limitations",
        list: [
          "The project is a working demo, not a production client system.",
          "The supplied routing output does not prove successful webhook delivery.",
          "The policy screenshot does not prove an AI failure or manual-review event occurred.",
          "Operational monitoring, delivery receipts, and production-scale retry behaviour are not demonstrated.",
        ],
      },
      {
        id: "improvements",
        title: "Next improvements",
        list: [
          "Add a repeatable end-to-end test harness for representative lead outcomes.",
          "Persist delivery attempts and external acknowledgement states.",
          "Add secrets management and environment-specific dispatcher configuration.",
          "Instrument retry, dead-letter, and manual-review queues.",
        ],
      },
      {
        id: "actions",
        title: "Explore the system",
        actions: [{ label: "View source code", href: links.leadFlowSource }],
      },
    ],
    heroAsset: assets.leadFlowWorkflow,
  },
};

const makeAsset = (name, width, height, alt) => ({
  src: `/assets/${name}.webp`,
  fallback: `/assets/${name}.png`,
  avif: [
    `/assets/${name}-640.avif 640w`,
    `/assets/${name}-960.avif 960w`,
    `/assets/${name}.avif ${width}w`,
  ].join(", "),
  webp: [
    `/assets/${name}-640.webp 640w`,
    `/assets/${name}-960.webp 960w`,
    `/assets/${name}.webp ${width}w`,
  ].join(", "),
  width,
  height,
  alt,
});

export const assets = {
  gitAnalyzerDashboard: makeAsset(
    "gitanalyzer-dashboard",
    1420,
    907,
    "GitAnalyzer repository report for facebook/react showing a 6.7 out of 10 commit-quality score and repository summary.",
  ),
  gitAnalyzerScoring: makeAsset(
    "gitanalyzer-scoring",
    1594,
    907,
    "GitAnalyzer scoring breakdown separating commit clarity, structure, consistency, and quality distribution.",
  ),
  gitAnalyzerRecommendations: makeAsset(
    "gitanalyzer-recommendations",
    1594,
    907,
    "GitAnalyzer recommendations generated from patterns found in the analyzed repository.",
  ),
  gitAnalyzerAiSuggestion: makeAsset(
    "gitanalyzer-ai-suggestion",
    1594,
    907,
    "GitAnalyzer AI-assisted commit suggestion grounded in the visible code diff.",
  ),
  harborTerminal: makeAsset(
    "harbor-gc-history-terminal",
    1260,
    880,
    "Terminal output for harbor gc history showing a readable table of garbage-collection jobs, statuses, parameters, and creation times.",
  ),
  harborLoginDiff: makeAsset(
    "harbor-login-validation-diff",
    1427,
    511,
    "Harbor CLI login command diff adding mutual exclusion between password and password-stdin flags.",
  ),
  harborReview: makeAsset(
    "harbor-review-evidence",
    1178,
    370,
    "Harbor CLI pull request 930 showing an approved review and LGTM comment.",
  ),
  leadFlowWorkflow: makeAsset(
    "leadflow-workflow",
    1594,
    907,
    "Full n8n LeadFlow orchestration canvas with intake, normalization, enrichment, qualification, routing, and failure paths.",
  ),
  leadFlowQualification: makeAsset(
    "leadflow-qualification-result",
    1276,
    961,
    "Sample LeadFlow qualified result showing a score, confidence, and explicit qualification reasons.",
  ),
  leadFlowRouting: makeAsset(
    "leadflow-routing-plan",
    1544,
    961,
    "LeadFlow output showing a qualified result converted into a priority route and webhook destination plan.",
  ),
  leadFlowPolicy: makeAsset(
    "leadflow-policy-fallback",
    1259,
    871,
    "LeadFlow hybrid qualification policy showing versioned rules and fallback-to-rules configuration.",
  ),
  musicBlocksDiff: makeAsset(
    "musicblocks-error-handling-diff",
    1424,
    834,
    "Music Blocks code diff replacing primitive string exceptions with standard Error objects and updating affected tests.",
  ),
};

export const musicBlocksVideo = {
  src: "/assets/musicblocks-connection-feedback.mp4",
  poster: "/assets/musicblocks-connection-feedback-poster.webp",
  width: 874,
  height: 798,
  description:
    "A block is detached, moved, and reconnected; a brief highlight confirms the successful connection.",
};

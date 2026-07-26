import { spawnSync } from "node:child_process";
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const root = process.cwd();
const originalDir = path.join(root, "public", "assets", "originals");
const outputDir = path.join(root, "public", "assets");

await mkdir(outputDir, { recursive: true });

const images = [
  {
    source: "gitanalyzer-dashboard.png",
    target: "gitanalyzer-dashboard",
  },
  {
    source: "gitanalyzer-scoring.png",
    target: "gitanalyzer-scoring",
  },
  {
    source: "gitanalyzer-recommmendations.png",
    target: "gitanalyzer-recommendations",
  },
  {
    source: "gitanalyzer-ai-suggestion.png",
    target: "gitanalyzer-ai-suggestion",
  },
  {
    source: "harbor-gc-history-terminal.png",
    target: "harbor-gc-history-terminal",
    crop: { left: 68, top: 96, width: 1260, height: 880 },
  },
  {
    source: "harbor-login-validation-diff.png",
    target: "harbor-login-validation-diff",
  },
  {
    source: "harbor-review-evidence.png",
    target: "harbor-review-evidence",
    crop: { left: 0, top: 0, width: 1178, height: 370 },
  },
  {
    source: "leadflow-workflow.png",
    target: "leadflow-workflow",
  },
  {
    source: "leadflow-qualification-result.png",
    target: "leadflow-qualification-result",
  },
  {
    source: "leadflow-routing-dispatch.png",
    target: "leadflow-routing-plan",
  },
  {
    source: "leadflow-fallback-review.png",
    target: "leadflow-policy-fallback",
  },
  {
    source: "musicblocks-error-handling-diff.png",
    target: "musicblocks-error-handling-diff",
  },
];

async function makeImageVariants({ source, target, crop }) {
  const sourcePath = path.join(originalDir, source);
  const pngPath = path.join(outputDir, `${target}.png`);
  let pipeline = sharp(sourcePath);

  if (crop) {
    pipeline = pipeline.extract(crop);
    await pipeline.clone().png().toFile(pngPath);
  } else {
    await copyFile(sourcePath, pngPath);
  }

  const metadata = await sharp(pngPath).metadata();
  const widths = [640, 960].filter((width) => width < metadata.width);

  for (const width of widths) {
    await sharp(pngPath)
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 52, effort: 5 })
      .toFile(path.join(outputDir, `${target}-${width}.avif`));
    await sharp(pngPath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 78, effort: 5 })
      .toFile(path.join(outputDir, `${target}-${width}.webp`));
  }

  await sharp(pngPath)
    .avif({ quality: 56, effort: 5 })
    .toFile(path.join(outputDir, `${target}.avif`));
  await sharp(pngPath)
    .webp({ quality: 80, effort: 5 })
    .toFile(path.join(outputDir, `${target}.webp`));

  process.stdout.write(
    `${target}: ${metadata.width}x${metadata.height} (${widths.join(", ")} + full)\n`,
  );
}

for (const image of images) {
  await makeImageVariants(image);
}

const videoSource = path.join(
  originalDir,
  "musicblocks-connection-feedback.mp4",
);
const videoOutput = path.join(outputDir, "musicblocks-connection-feedback.mp4");
const posterOutput = path.join(
  outputDir,
  "musicblocks-connection-feedback-poster.webp",
);

const trim = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    "6.25",
    "-t",
    "4.5",
    "-i",
    videoSource,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "26",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    videoOutput,
  ],
  { stdio: "inherit" },
);

if (trim.status !== 0) {
  throw new Error("Video trimming failed.");
}

const poster = spawnSync(
  ffmpegPath,
  [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    "2",
    "-i",
    videoOutput,
    "-frames:v",
    "1",
    "-vf",
    "scale=874:-1",
    posterOutput,
  ],
  { stdio: "inherit" },
);

if (poster.status !== 0) {
  throw new Error("Video poster generation failed.");
}

process.stdout.write(
  "Processed responsive screenshots and a 4.5 second video cycle.\n",
);

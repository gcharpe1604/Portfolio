import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const assets = fileURLToPath(new URL("../public/assets/", import.meta.url));
const fontfile = fileURLToPath(
  new URL("../public/fonts/manrope-variable.ttf", import.meta.url),
);
const destination = path.join(assets, "social");
await mkdir(destination, { recursive: true });

const cards = [
  {
    name: "portfolio",
    label: "PROJECTS / OPEN SOURCE",
    title: "Govind Charpe",
    lines: ["Full-stack developer.", "Curious by default."],
    footer: "COMPUTER SCIENCE STUDENT / BENGALURU",
  },
  {
    name: "gitanalyzer",
    label: "PROJECT CASE STUDY",
    title: "GitAnalyzer",
    lines: ["Repository history.", "Practical feedback."],
    footer: "GOVIND CHARPE / PROJECTS",
    screenshot: "gitanalyzer-dashboard.png",
  },
  {
    name: "leadflow",
    label: "PROJECT CASE STUDY",
    title: "LeadFlow",
    lines: ["Qualification.", "Routing. Review."],
    footer: "GOVIND CHARPE / PROJECTS",
    screenshot: "leadflow-workflow.png",
  },
  {
    name: "open-source",
    label: "OPEN-SOURCE CONTRIBUTIONS",
    title: "Working in",
    lines: ["real codebases."],
    footer: "GOVIND CHARPE / HARBOR CLI + MUSIC BLOCKS",
    screenshot: "harbor-gc-history-terminal.png",
  },
];

async function text(value, size, color, left, top) {
  const input = await sharp({
    text: {
      text: `<span foreground="${color}">${value}</span>`,
      font: `Manrope ${size}`,
      fontfile,
      rgba: true,
      dpi: 72,
    },
  })
    .png()
    .toBuffer();
  return { input, left, top };
}

for (const card of cards) {
  const background =
    Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <rect width="1200" height="630" fill="#222b25"/>
    <path d="M64 508H1136" stroke="#506052"/>
    <circle cx="1110" cy="100" r="182" fill="#debd4e" opacity=".07"/>
    <path d="M1048 348L1136 260M1080 260H1136V316" fill="none" stroke="#f79d84" stroke-width="3"/>
  </svg>`);
  const overlays = [
    {
      input: await sharp(path.join(assets, "gc-mark.svg"))
        .resize(64, 64)
        .png()
        .toBuffer(),
      left: 64,
      top: 54,
    },
    await text(card.label, 20, "#f79d84", 154, 73),
    await text(card.title, card.screenshot ? 60 : 78, "#f3efe5", 64, 172),
    ...(await Promise.all(
      card.lines.map((line, index) =>
        text(line, 42, "#debd4e", 64, 282 + index * 60),
      ),
    )),
    await text(card.footer, 18, "#c5cdc1", 64, 551),
  ];
  if (card.screenshot) {
    overlays.push({
      input: await sharp(path.join(assets, card.screenshot))
        .resize(480, 300, { fit: "contain", background: "#161c18" })
        .png()
        .toBuffer(),
      left: 656,
      top: 164,
    });
  }
  await sharp(background)
    .composite(overlays)
    .png({ compressionLevel: 9 })
    .toFile(path.join(destination, `${card.name}.png`));
}

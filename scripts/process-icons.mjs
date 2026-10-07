import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const assets = fileURLToPath(new URL("../public/assets/", import.meta.url));
for (const size of [32, 192, 512]) {
  await sharp(path.join(assets, "gc-mark.svg"), { density: 768 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(path.join(assets, `gc-mark-${size}.png`));
}

import { stat, writeFile } from "fs/promises";
import fetch from "node-fetch";
const sharp = require("sharp");

export default async function cacheImage(imageUrl: string, siteUrl: string) {
  const filename = imageUrl.split("?")[0].split("/").pop() || "";
  if (filename) {
    const filepath = `src/static/medias/${filename}`;
    const minFilename = filepath.replace(/(\.[\w\d_-]+)$/i, "--min$1");
    const medFilename = filepath.replace(/(\.[\w\d_-]+)$/i, "--med$1");
    try {
      await stat(filepath);
    } catch (err) {
      const res = await fetch(`${siteUrl}/static/medias/${filename}`);
      if (res.status === 404) {
        const res = await fetch(imageUrl);
        const buffer = await res.buffer();
        await writeFile(filepath, buffer);

        const metadata = await sharp(filepath).metadata();

        if (metadata.width && metadata.width >= 360 && metadata.width <= 800) {
          await sharp(filepath).rotate().resize(360).toFile(minFilename);
        } else if (metadata.width && metadata.width > 800) {
          await Promise.all(
            [{ width: 800 }, { width: 360 }].map((size) => {
              return sharp(`src/static/medias/${filename}`)
                .rotate()
                .resize(size.width, size.width)
                .toFile(size.width === 360 ? minFilename : medFilename);
            })
          );
        }
      }
      return filename;
    }
  }
}

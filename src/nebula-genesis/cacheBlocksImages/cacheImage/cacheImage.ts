import { stat, writeFile } from "fs/promises";
import fetch from "node-fetch";
const sharp = require("sharp");

export default async function cacheImage(imageUrl: string, siteUrl: string) {
  const filename = imageUrl.split("?")[0].split("/").pop() || "";
  if (filename) {
    const filepath = `src/static/medias/${filename}`;
    try {
      await stat(filepath);
    } catch (err) {
      const res = await fetch(`${siteUrl}/static/medias/${filename}`);
      if (res.status === 404) {
        console.log(filename);
        const res = await fetch(imageUrl);
        console.log("res");
        const buffer = await res.buffer();
        console.log("buffer");
        await writeFile(filepath, buffer);
        console.log("writefile");

        const metadata = await sharp(filepath).metadata();

        const sizes = [
          {
            width: 800,
            path: "--med$1",
          },
          {
            width: 360,
            path: "--min$1",
          },
        ];

        if (metadata.width && metadata.width >= 360 && metadata.width <= 800) {
          await sharp(filepath)
            .rotate()
            .resize(sizes[1].width)
            .toFile(
              `src/static/medias/${filename.replace(
                /(\.[\w\d_-]+)$/i,
                sizes[1].path
              )}`
            );
        } else if (metadata.width && metadata.width > 800) {
          await Promise.all(
            sizes.map((size) => {
              return sharp(`src/static/medias/${filename}`)
                .rotate()
                .resize(size.width, size.width)
                .toFile(
                  `src/static/medias/${filename.replace(
                    /(\.[\w\d_-]+)$/i,
                    size.path
                  )}`
                );
            })
          );
        }
      }
      return filename;
    }
  }
}

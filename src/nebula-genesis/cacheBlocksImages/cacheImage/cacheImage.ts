import { stat, writeFile } from "fs/promises";
import fetch from "node-fetch";
import { MultisizedImage } from "statikon";
const sharp = require("sharp");
const probe = require("probe-image-size");

export default async function cacheImage(
  imageUrl: string,
  siteUrl: string
): Promise<MultisizedImage | string | undefined> {
  const filename = imageUrl.split("?")[0].split("/").pop() || "";
  if (filename) {
    let result = await probe(imageUrl);
    console.log(result.width);
    const filepath = `src/static/medias/${filename}`;
    try {
      await stat(filepath);
    } catch (err) {
      const res = await fetch(`${siteUrl}/static/medias/${filename}`);

      if (res.status === 404) {
        const res = await fetch(imageUrl);
        const buffer = await res.buffer();
        await writeFile(filepath, buffer);

        let urls: MultisizedImage = {
          standardUrl: `/static/medias/${filename}`,
        };
        const metadata = await sharp(filepath).metadata();

        if (metadata.width && metadata.width >= 360) {
          urls.minUrl = `/static/medias/${filename.replace(
            /(\.[\w\d_-]+)$/i,
            "--min$1"
          )}`;

          if (metadata.width <= 800) {
            await sharp(filepath)
              .rotate()
              .resize(360)
              .toFile("src" + urls.minUrl);
          } else {
            urls.medUrl = `/static/medias/${filename.replace(
              /(\.[\w\d_-]+)$/i,
              "--med$1"
            )}`;
            await Promise.all(
              [{ width: 800 }, { width: 360 }].map((size) => {
                return sharp(filepath)
                  .rotate()
                  .resize(size.width, size.width)
                  .toFile(
                    size.width === 360
                      ? "src" + urls.minUrl
                      : "src" + urls.medUrl
                  );
              })
            );
          }
        }

        return urls;
      }
    }
    return `/static/medias/${filename}`;
  }
}

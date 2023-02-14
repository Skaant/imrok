import { stat, writeFile } from "fs/promises";
import fetch from "node-fetch";
import { MultisizedImage } from "statikon";
import sharp from "sharp";
import probe from "probe-image-size";

export default async function cacheImage(
  imageUrl: string,
  siteUrl: string
): Promise<MultisizedImage | string | undefined> {
  const filename = imageUrl.split("?")[0].split("/").pop() || "";
  if (filename) {
    const filepath = `src/static/medias/${filename}`;
    try {
      await stat(filepath);
    } catch (err) {
      let result = await probe(imageUrl);
      const res = await fetch(`${siteUrl}/static/medias/${filename}`);

      let urls: MultisizedImage = {
        standardUrl: `/static/medias/${filename}`,
      };

      if (
        res.status === 404 ||
        (result.width >= 360 && !urls.minUrl && !urls.medUrl)
      ) {
        const res = await fetch(imageUrl);
        const buffer = await res.buffer();
        await writeFile(filepath, buffer);

        urls.minUrl = `/static/medias/${filename.replace(
          /(\.[\w\d_-]+)$/i,
          "--min$1"
        )}`;

        if (result.width <= 800) {
          await sharp(filepath)
            .rotate()
            .resize({
              width: 360,
              fit: "inside",
            })
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
                .resize(size.width, size.width, {
                  fit: "inside",
                })
                .toFile(
                  size.width === 360 ? "src" + urls.minUrl : "src" + urls.medUrl
                );
            })
          );
        }

        return urls;
      }
    }
    return `/static/medias/${filename}`;
  }
}

import { ExtendedBlockObjectResponse, ResizedImageBlockObject } from "statikon";
import cacheImage from "./cacheImage/cacheImage";

export default async function cacheBlocksImages(
  blocks: ExtendedBlockObjectResponse[],
  siteUrl: string
) {
  await Promise.all(
    blocks
      .filter((block) => block.type === "image" && block.image.type === "file")
      .map(async (block) => {
        /* Redudant block type checking for TS typing */
        if (block.type === "image" && block.image.type === "file") {
          /**
           * @todo `cacheImage` should send back multiple urls
           *  to provide `ResizedImageBlockObject` below.
           */
          const filename = await cacheImage(block.image.file.url, siteUrl);
          if (filename) {
            block = {
              id: block.id,
              type: "resized_image",
              standardUrl: `/static/medias/${filename}`,
              minUrl: `src/static/medias/${filename.replace(
                /(\.[\w\d_-]+)$/i,
                "--min$1"
              )}`,
              medUrl: `src/static/medias/${filename.replace(
                /(\.[\w\d_-]+)$/i,
                "--med$1"
              )}`,
            } as ResizedImageBlockObject;
          }
        }
      })
  );
}

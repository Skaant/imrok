import { ExtendedBlockObjectResponse, ResizedImageBlockObject } from "statikon";
import cacheImage from "./cacheImage/cacheImage";

export default async function cacheBlocksImages(
  blocks: ExtendedBlockObjectResponse[],
  siteUrl: string
) {
  return await Promise.all(
    blocks.map(async (block) => {
      /* Redudant block type checking for TS typing */
      if (block.type === "image" && block.image.type === "file") {
        const urls = await cacheImage(block.image.file.url, siteUrl);

        if (typeof urls === "object") {
          block = {
            id: block.id,
            type: "resized_image",
            ...urls,
          };
        } else if (typeof urls === "string") {
          block.image.file.url = urls;
        }
      }
      return block;
    })
  );
}

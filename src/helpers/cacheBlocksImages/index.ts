import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import ifImageBlockCache from "./ifImageBlockCache";

export default async function cacheBlocksImages(blocks: BlockObjectResponse[]) {
  await Promise.all(
    blocks
      .filter((block) => block.type === "image" && block.image.type === "file")
      .map(async (block) => {
        /** Redudant block type checking for TS typing */
        ifImageBlockCache(block);
      })
  );
}

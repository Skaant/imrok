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
        const filepaths = await cacheImage(block.image.file.url, siteUrl);
        console.log(filepaths);

        filepaths?.filepath && !filepaths.minFilepath && !filepaths.medFilepath
          ? (block = {
              id: block.id,
              type: "resized_image",
              standardUrl: filepaths.filepath,
            } as ResizedImageBlockObject)
          : filepaths?.filepath &&
            filepaths.minFilepath &&
            !filepaths.medFilepath
          ? (block = {
              id: block.id,
              type: "resized_image",
              standardUrl: filepaths.filepath,
              minUrl: filepaths.minFilepath,
            } as ResizedImageBlockObject)
          : filepaths?.filepath &&
            filepaths.minFilepath &&
            filepaths.medFilepath
          ? (block = {
              id: block.id,
              type: "resized_image",
              standardUrl: filepaths.filepath,
              minUrl: filepaths.minFilepath,
              medUrl: filepaths.medFilepath,
            } as ResizedImageBlockObject)
          : "";
      }
      return block;
    })
  );
}

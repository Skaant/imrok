import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { stat, writeFile } from "fs/promises";
import fetch from "node-fetch";

async function imageCache(url: string) {
  const filename = url.split("?")[0].split("/").pop() || "";
  if (filename) {
    const filepath = `src/static/medias/${filename}`;
    try {
      await stat(filepath);
    } catch (err) {
      const res = await fetch(`https://imrok.fr/static/medias/${filename}`);
      if (res.status === 404) {
        const res = await fetch(url);
        const buffer = await res.buffer();
        await writeFile(filepath, buffer);
      }
    }
    return filename;
  }
}

async function ifImageBlockCache(block: BlockObjectResponse) {
  if (block.type === "image" && block.image.type === "file") {
    const filename = await imageCache(block.image.file.url);
    if (filename) {
      block.image.file.url = `/static/medias/${filename}`;
    }
  }
}

export default ifImageBlockCache;

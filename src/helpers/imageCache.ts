import { writeFile } from "fs/promises";
import fetch from "node-fetch";

async function imageCache(url: string) {
  const filename = url.split("?")[0].split("/").pop() || "";
  if (filename) {
    const res = await fetch(`https://imrok.fr/_medias/${filename}`);
    if (res.status === 404) {
      const res = await fetch(url);
      const buffer = await res.buffer();
      await writeFile(`src/static/_medias/${filename}`, buffer);
    }
    return filename;
  }
}

export default imageCache;

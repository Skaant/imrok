import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import cacheBlocksImages from "./cacheBlocksImages";

export default async function provisionContent(
  page: PageObjectResponse,
  notion: Client
) {
  let res;
  const blocks: BlockObjectResponse[] = [];
  do {
    res = await notion.blocks.children.list({
      block_id: page.id,
      start_cursor: (res && res.next_cursor) || undefined,
    });
    blocks.push(...(res.results as BlockObjectResponse[]));
  } while (res.has_more);
  cacheBlocksImages(blocks);
  return { page, blocks };
}

import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { ExtendedBlockObjectResponse } from "statikon";
import abstractBlocks from "./abstractBlocks/abstractBlocks";
import cacheBlocksImages from "./cacheBlocksImages/cacheBlocksImages";
import getDatabasePages from "./getDatabasePages/getDatabasePages";
import getPageBlocks from "./getPageBlocks/getPageBlocks";

type ExtendedPage = PageObjectResponse & {
  blocks: ExtendedBlockObjectResponse[];
};

export default async function getDatabaseContent(
  notionClient: Client,
  databaseId: string,
  /** Used to test if images are already present online */
  siteUrl: string,
  params?: object
): Promise<ExtendedPage[]> {
  const pages = await getDatabasePages(notionClient, databaseId, params);

  const _pages = await Promise.all(
    pages.map(async (page) => {
      const blocks = await getPageBlocks(notionClient, page.id);
      await cacheBlocksImages(blocks, siteUrl);
      const _blocks = abstractBlocks(blocks);
      return {
        ...page,
        blocks: _blocks,
      };
    })
  );

  return _pages;
}

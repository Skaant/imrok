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
      let blocks = (await getPageBlocks(
        notionClient,
        page.id
      )) as ExtendedBlockObjectResponse[];
      blocks = await cacheBlocksImages(blocks, siteUrl);
      blocks = abstractBlocks(blocks);
      return {
        ...page,
        blocks,
      };
    })
  );

  return _pages;
}

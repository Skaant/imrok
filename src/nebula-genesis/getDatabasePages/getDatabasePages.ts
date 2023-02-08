import { Client } from "@notionhq/client";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

export default async function getDatabasePages(
  notion: Client,
  databaseId: string,
  params: object = {}
): Promise<PageObjectResponse[]> {
  let res: QueryDatabaseResponse | undefined;
  const pages: PageObjectResponse[] = [];

  do {
    res = await notion.databases.query({
      database_id: databaseId,
      start_cursor: (res && res.next_cursor) || undefined,
      ...params,
    });
    pages.push(...(res.results as PageObjectResponse[]));
  } while (res.has_more);

  return pages;
}

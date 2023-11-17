import { readFile } from "fs/promises";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getArticleFromPageObjectResponse } from "./getArticleFromPageObjectResponse";

export async function getArticlesCache() {
  return (
    JSON.parse(
      await readFile("./cache/articles/pages.json", "utf-8")
    ) as PageObjectResponse[]
  )
    .map(getArticleFromPageObjectResponse)
    .filter(({ date }) => date)
    .sort((a, b) => {
      return (b.date as string).localeCompare(a.date as string);
    });
}

import {
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { Article } from "../types/Article";
import titlePropToString from "./titlePropToString";
import richTextToString from "./richTextToString";

export function getArticleFromPageObjectResponse(
  page: PageObjectResponse
): PageObjectResponse & Article {
  const { id, properties } = page;
  const createdAt =
    properties["Créé le"].type === "date"
      ? properties["Créé le"].date?.start
      : undefined;
  const publishedAt =
    properties["Publié le"].type === "date"
      ? properties["Publié le"].date?.start
      : undefined;
  const editedAt =
    properties["Édité le"].type === "date"
      ? properties["Édité le"].date?.start
      : undefined;
  return {
    ...page,
    id,
    url:
      properties["Url"].type === "rich_text"
        ? richTextToString(
            properties["Url"].rich_text as TextRichTextItemResponse[]
          )
        : `/oups-${id}`,
    title:
      properties["Name"].type === "title"
        ? titlePropToString(properties["Name"])
        : "oups",
    category:
      (properties["Type de contenu"].type === "select" &&
        properties["Type de contenu"].select?.name) ||
      "categorie",
    createdAt,
    publishedAt,
    editedAt,
    date: editedAt || publishedAt || createdAt,
  };
}

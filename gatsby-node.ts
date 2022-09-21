import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import path from "path";
import richTextToString from "./src/helpers/richTextToString";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  const { results: pages } = await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
    filter: { property: "Contexte", select: { equals: "Page" } },
  });

  const _pages = await Promise.all(
    (pages as PageObjectResponse[]).map(async (page) => {
      const { results: blocks } = await notion.blocks.children.list({
        block_id: page.id,
      });
      return { page, blocks };
    })
  );

  _pages.forEach(({ page, blocks }) => {
    const { Name: name, Url: url } = page.properties;

    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path:
        url.type === "rich_text"
          ? richTextToString(url.rich_text as TextRichTextItemResponse[])
          : page.id,
      context: {
        title:
          name.type === "title" &&
          (name.title[0] as TextRichTextItemResponse).text.content,
        blocks: blocks as BlockObjectResponse[],
      },
    });
  });

  const { results: contents } = await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
    filter: { property: "Contexte", select: { equals: "Contenu" } },
  });

  const _contents = await Promise.all(
    (contents as PageObjectResponse[]).map(async (content) => {
      const { results: blocks } = await notion.blocks.children.list({
        block_id: content.id,
      });
      return { content, blocks };
    })
  );

  _contents.forEach(({ content, blocks }) => {
    const { Name: name, Url: url } = content.properties;
    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path:
        url.type === "rich_text"
          ? richTextToString(url.rich_text as TextRichTextItemResponse[])
          : content.id,
      context: {
        title:
          name.type === "title" &&
          (name.title[0] as TextRichTextItemResponse).text.content,
        blocks: blocks as BlockObjectResponse[],
      },
    });
  });
};

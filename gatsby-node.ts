import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import path from "path";

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
    pages.map(async (page) => {
      const { results: blocks } = await notion.blocks.children.list({
        block_id: page.id,
      });
      return { page, blocks };
    })
  );

  _pages.forEach(({ page, blocks }) => {
    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path: page.id,
      context: {
        title: (
          (page as PageObjectResponse).properties["Name"] as {
            title: TextRichTextItemResponse[];
          }
        ).title[0].text.content,
        blocks: blocks as BlockObjectResponse[],
      },
    });
  });
};

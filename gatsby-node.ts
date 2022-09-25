import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import path from "path";
import richTextToString from "./src/helpers/richTextToString";
import { DefaultTemplateContext } from "./src/templates/default.template";
import titlePropToString from "./src/helpers/titlePropToString";
import { contentsState } from "./src/states/contents.state";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  const pages = (
    await notion.databases.query({
      database_id: process.env.DATABASE_ID as string,
      filter: { property: "Contexte", select: { equals: "Page" } },
    })
  ).results as PageObjectResponse[];

  const _pages = await Promise.all(
    (pages as PageObjectResponse[]).map(async (page) => {
      const { results: blocks } = await notion.blocks.children.list({
        block_id: page.id,
      });
      return { page, blocks };
    })
  );

  contentsState.contents = (
    await notion.databases.query({
      database_id: process.env.DATABASE_ID as string,
      filter: { property: "Contexte", select: { equals: "Contenu" } },
    })
  ).results as PageObjectResponse[];

  const _contents = await Promise.all(
    contentsState.contents.map(async (content) => {
      const { results: blocks } = await notion.blocks.children.list({
        block_id: content.id,
      });
      return { content, blocks };
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
        title: name.type === "title" && titlePropToString(name),
        blocks: blocks as BlockObjectResponse[],
      } as DefaultTemplateContext,
    });
  });

  _contents.forEach(({ content, blocks }) => {
    const { Name: name, Url: url, ["Créé le"]: date } = content.properties;
    let _date;
    if (date.type === "date" && date.date) {
      _date = new Date(date.date.start);
    }
    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path:
        url.type === "rich_text"
          ? richTextToString(url.rich_text as TextRichTextItemResponse[])
          : content.id,
      context: {
        title: name.type === "title" && titlePropToString(name),
        date: _date,
        blocks: blocks as BlockObjectResponse[],
      } as DefaultTemplateContext,
    });
  });
};

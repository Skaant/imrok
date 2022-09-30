import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import path from "path";
import richTextToString from "./src/helpers/richTextToString";
import titlePropToString from "./src/helpers/titlePropToString";
import { DefaultTemplateContext } from "statikon";
import datePropToDate from "./src/helpers/datePropToDate";
import cacheBlocksImages from "./src/helpers/cacheBlocksImages";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    node: {
      fs: "empty",
    },
  });
};

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
      cacheBlocksImages(blocks as BlockObjectResponse[]);
      return { page, blocks };
    })
  );

  const contents = (
    await notion.databases.query({
      database_id: process.env.DATABASE_ID as string,
      filter: { property: "Contexte", select: { equals: "Contenu" } },
    })
  ).results as PageObjectResponse[];

  const _contents = await Promise.all(
    contents.map(async (content) => {
      const { results: blocks } = await notion.blocks.children.list({
        block_id: content.id,
      });
      cacheBlocksImages(blocks as BlockObjectResponse[]);
      return { content, blocks };
    })
  );

  const sharedProps: Pick<
    DefaultTemplateContext,
    "navbar" | "contents" | "footer"
  > = {
    navbar: {
      links: [
        {
          title: "Pensées",
          path: "/pensees",
        },
        {
          title: "Illustrations",
          path: "/illustrations",
        },
        {
          title: "Vidéos",
          path: "/videos",
        },
      ],
    },
    contents,
    footer: {
      links: [
        {
          title: "Accueil",
          path: "/",
        },
        {
          title: "Pensées",
          path: "/pensees",
        },
        {
          title: "Illustrations",
          path: "/illustrations",
        },
        {
          title: "Vidéos",
          path: "/videos",
        },
      ],
    },
  };

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
        ...sharedProps,
      } as DefaultTemplateContext,
    });
  });

  _contents.forEach(({ content, blocks }) => {
    const {
      Name: name,
      Url: url,
      ["Créé le"]: createdAt,
      ["Publié le"]: publishedAt,
      ["Édité le"]: editedAt,
    } = content.properties;
    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path:
        url.type === "rich_text"
          ? richTextToString(url.rich_text as TextRichTextItemResponse[])
          : content.id,
      context: {
        title: name.type === "title" && titlePropToString(name),
        createdAt: createdAt.type === "date" && datePropToDate(createdAt),
        publishedAt: publishedAt.type === "date" && datePropToDate(publishedAt),
        editedAt: editedAt.type === "date" && datePropToDate(editedAt),
        blocks: blocks as BlockObjectResponse[],
        ...sharedProps,
      } as DefaultTemplateContext,
    });
  });
};

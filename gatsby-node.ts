import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { readFile } from "fs/promises";
import path from "path";
import richTextToString from "./src/helpers/richTextToString";
import titlePropToString from "./src/helpers/titlePropToString";
import { DefaultTemplateContext } from "nebula-atoms";
import datePropToDate from "./src/helpers/datePropToDate";
import { COLORS } from "./src/enums/colors.enum";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        fs: false,
      },
    },
  });
};

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;

  const TITLE = "IMROK.fr, le hub créatif de Romaric Ruga";

  /*
   * 1. PAGE [& CONTENTS] RETRIEVING
   */

  const pagesCache = JSON.parse(
    await readFile("./cache/pages/pages.json", "utf-8")
  ) as PageObjectResponse[];

  const pages = await Promise.all(
    pagesCache.map(async (page) => ({
      page,
      blocks: JSON.parse(
        await readFile(`./cache/pages/pages/${page.id}/page.json`, "utf-8")
      ) as BlockObjectResponse[],
    }))
  );

  const articlesCache = JSON.parse(
    await readFile("./cache/articles/pages.json", "utf-8")
  ) as PageObjectResponse[];

  const articles = await Promise.all(
    articlesCache.map(async (page) => ({
      page,
      blocks: JSON.parse(
        await readFile(`./cache/articles/pages/${page.id}/page.json`, "utf-8")
      ) as BlockObjectResponse[],
    }))
  );

  /*
   * 2. RENDERING SHARED PROPS
   */

  const sharedProps: Pick<
    DefaultTemplateContext,
    "navbar" | "contents" | "footer"
  > = {
    navbar: {
      title: "IMROK.fr",
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
    contents: articlesCache,
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
      contact: true,
    },
  };

  /*
   * 3. PAGE [& CONTENTS] RENDERING
   */

  pages.forEach(({ page, blocks }) => {
    const {
      Name: name,
      Url: url,
      Description: description,
      Robots: robots,
    } = page.properties;

    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path:
        url.type === "rich_text"
          ? richTextToString(url.rich_text as TextRichTextItemResponse[])
          : page.id,
      context: {
        pageTitle: `${
          name.type === "title" && titlePropToString(name)
        } | ${TITLE}`,
        blocks,
        head: {
          title: `${
            name.type === "title" && titlePropToString(name)
          } | ${TITLE}`,
          description:
            description.type === "rich_text" &&
            richTextToString(
              description.rich_text as TextRichTextItemResponse[]
            ),
          noIndex: robots.type === "select" && robots.select?.name === "Masqué",
        },
        ...sharedProps,
      } as DefaultTemplateContext,
    });
  });

  articles.forEach(({ page, blocks }) => {
    const {
      Name: name,
      Url: url,
      Description: description,
      Robots: robots,
      ["Créé le"]: createdAt,
      ["Publié le"]: publishedAt,
      ["Édité le"]: editedAt,
    } = page.properties;
    const _url =
      url.type === "rich_text" &&
      richTextToString(url.rich_text as TextRichTextItemResponse[]);
    if (_url) {
      createPage({
        component: path.resolve("./src/templates/default.template.tsx"),
        path: _url,
        context: {
          pageTitle: `${
            name.type === "title" && titlePropToString(name)
          } | ${TITLE}`,
          head: {
            description:
              description.type === "rich_text" &&
              richTextToString(
                description.rich_text as TextRichTextItemResponse[]
              ),
            noIndex:
              robots.type === "select" && robots.select?.name === "Masqué",
          },
          createdAt: createdAt.type === "date" && datePropToDate(createdAt),
          publishedAt:
            publishedAt.type === "date" && datePropToDate(publishedAt),
          editedAt: editedAt.type === "date" && datePropToDate(editedAt),
          blocks,
          ...sharedProps,
        } as DefaultTemplateContext,
      });
    } else {
      console.info(
        `URL manquant pour la page : ${
          name.type === "title" && titlePropToString(name)
        }`
      );
    }
  });
};

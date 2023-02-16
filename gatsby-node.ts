import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import path from "path";
import richTextToString from "./src/helpers/richTextToString";
import titlePropToString from "./src/helpers/titlePropToString";
import { DefaultTemplateContext } from "statikon";
import datePropToDate from "./src/helpers/datePropToDate";
import { COLORS } from "./src/enums/colors.enum";
import getDatabaseContent from "./src/nebula-genesis/getDatabaseContent";

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

  /*
   * 1. PAGE [& CONTENTS] RETRIEVING
   */

  const pages = await getDatabaseContent(
    notion,
    process.env.DATABASE_ID as string,
    "https://imrok.fr",
    { filter: { property: "Contexte", select: { equals: "Page" } } }
  );

  /** These instructions shouldn't be activated for basic website. */

  const contents = await getDatabaseContent(
    notion,
    process.env.DATABASE_ID as string,
    "https://imrok.fr",
    { filter: { property: "Contexte", select: { equals: "Contenu" } } }
  );

  /*
   * 2. RENDERING SHARED PROPS
   */

  const sharedProps: Pick<
    DefaultTemplateContext,
    "bg" | "text" | "navbar" | "contents" | "footer" | "activatedTiers"
  > = {
    activatedTiers: ["Youtube", "Soundcloud"],
    bg: COLORS.DEEP,
    text: COLORS.LIGHT,
    navbar: {
      bg: COLORS.PSIK,
      text: COLORS.GOLD,
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
      bg: COLORS.PSIK,
      text: COLORS.LIGHT,
      a: COLORS.GOLD,
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

  pages.forEach(({ blocks, ...page }) => {
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
        title: name.type === "title" && titlePropToString(name),
        blocks,
        head: {
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

  contents.forEach(({ blocks, ...page }) => {
    console.log(
      blocks
        .filter((block) => block.type == "resized_image")
        .map((block) => {
          return block.type;
        })
    );

    const {
      Name: name,
      Url: url,
      Description: description,
      Robots: robots,
      ["Créé le"]: createdAt,
      ["Publié le"]: publishedAt,
      ["Édité le"]: editedAt,
    } = page.properties;
    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path:
        url.type === "rich_text"
          ? richTextToString(url.rich_text as TextRichTextItemResponse[])
          : page.id,
      context: {
        title: name.type === "title" && titlePropToString(name),
        head: {
          description:
            description.type === "rich_text" &&
            richTextToString(
              description.rich_text as TextRichTextItemResponse[]
            ),
          noIndex: robots.type === "select" && robots.select?.name === "Masqué",
        },
        createdAt: createdAt.type === "date" && datePropToDate(createdAt),
        publishedAt: publishedAt.type === "date" && datePropToDate(publishedAt),
        editedAt: editedAt.type === "date" && datePropToDate(editedAt),
        blocks,
        ...sharedProps,
      } as DefaultTemplateContext,
    });
  });
};

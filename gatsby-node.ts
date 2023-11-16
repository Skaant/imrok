import type { GatsbyNode } from "gatsby";
import {
  BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { readFile } from "fs/promises";
import path from "path";
import richTextToString from "./src/helpers/richTextToString";
import titlePropToString from "./src/helpers/titlePropToString";
import { DefaultTemplateContext, Link } from "nebula-atoms";
import datePropToDate from "./src/helpers/datePropToDate";
import { HomeTemplateContext } from "./src/templates/home.template";
import { AllArticlesTemplateContext } from "./src/templates/all-articles.template";
import { LinkWithCategory } from "./src/types/LinkWithCategory";
import { CategoryTemplateContext } from "./src/templates/category.template";

type PageProperty =
  PageObjectResponse["properties"][keyof PageObjectResponse["properties"]];

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

function articleToLinkWithCategory({
  properties: { Name: name, Url: url, ["Type de contenu"]: category },
}: PageObjectResponse) {
  return {
    url:
      url.type === "rich_text" &&
      richTextToString(url.rich_text as TextRichTextItemResponse[]),
    label: name.type === "title" && titlePropToString(name),
    category: category.type === "select" && category.select?.name,
  } as LinkWithCategory;
}

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

  const articlesCache = (
    JSON.parse(
      await readFile("./cache/articles/pages.json", "utf-8")
    ) as PageObjectResponse[]
  ).sort((a, b) => {
    const aDateProp =
      ((a.properties?.["Édité le"] ||
        a.properties?.["Publié le"] ||
        a.properties?.["Créé le"]) as PageProperty) || false;
    if (!aDateProp || aDateProp.type !== "date" || !aDateProp.date) return -1;
    const bDateProp =
      ((b.properties?.["Édité le"] ||
        b.properties?.["Publié le"] ||
        b.properties?.["Créé le"]) as PageProperty) || false;
    if (!bDateProp || bDateProp.type !== "date" || !bDateProp.date) return 1;
    const aDate = aDateProp.date.start;
    const bDate = bDateProp.date.start;
    return aDate.localeCompare(bDate);
  });

  const articlesIndexByCategory: { [key: string]: number[] } = {};

  const articles = await Promise.all(
    articlesCache.map(async (page, index) => {
      const prop = page.properties["Type de contenu"];
      const category = prop.type === "select" && prop.select?.name;
      if (category) {
        if (!articlesIndexByCategory[category])
          articlesIndexByCategory[category] = [];
        articlesIndexByCategory[category].push(index);
      }
      return {
        page,
        blocks: JSON.parse(
          await readFile(`./cache/articles/pages/${page.id}/page.json`, "utf-8")
        ) as BlockObjectResponse[],
      };
    })
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
          title: "Tous les articles",
          path: "/articles",
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
        ...Object.entries(articlesIndexByCategory).map(
          ([category, indexes]) => ({
            title: category,
            path: `/categories/${category
              .slice(3)
              .toLocaleLowerCase()
              .replace(" ", "-")}`,
          })
        ),
        {
          title: "Tous les articles",
          path: "/articles",
        },
      ],
      contact: true,
    },
  };

  /*
   * 3. CONTENT RENDERING
   */

  // 3.1. PAGES

  pages.forEach(({ page, blocks }) => {
    const {
      Name: name,
      Url: url,
      Description: description,
      Robots: robots,
    } = page.properties;

    let context:
      | DefaultTemplateContext
      | HomeTemplateContext
      | AllArticlesTemplateContext = {
      pageTitle: (name.type === "title" && titlePropToString(name)) || "",
      blocks,
      head: {
        title: `${name.type === "title" && titlePropToString(name)} | ${TITLE}`,
        description:
          (description.type === "rich_text" &&
            richTextToString(
              description.rich_text as TextRichTextItemResponse[]
            )) ||
          "",
        noIndex:
          (robots.type === "select" && robots.select?.name === "Masqué") ||
          undefined,
      },
      ...sharedProps,
    };

    const slug =
      url.type === "rich_text"
        ? richTextToString(url.rich_text as TextRichTextItemResponse[])
        : page.id;

    let templateId = "default";

    switch (slug) {
      case "/":
        templateId = "home";
        context = {
          ...context,
          lastArticlesLink: articlesCache
            .slice(0, 10)
            .map(articleToLinkWithCategory),
          categoriesPageLink: Object.entries(articlesIndexByCategory).map(
            ([key, indexes]) => ({
              url: `/categories/${key
                .slice(3)
                .toLocaleLowerCase()
                .replace(" ", "-")}`,
              label: `${key} (${indexes.length})`,
            })
          ),
        } as HomeTemplateContext;
        break;
      case "/articles":
        templateId = "all-articles";
        context = {
          ...context,
          articlesLink: articlesCache.map(articleToLinkWithCategory),
        } as AllArticlesTemplateContext;
        break;
    }

    createPage({
      component: path.resolve(`./src/templates/${templateId}.template.tsx`),
      path: slug,
      context,
    });
  });

  // 3.2. CATEGORIES

  Object.entries(articlesIndexByCategory).forEach(([category, indexes]) => {
    createPage({
      component: path.resolve("./src/templates/category.template.tsx"),
      path: `/categories/${category
        .slice(3)
        .toLocaleLowerCase()
        .replace(" ", "-")}`,
      context: {
        head: {
          title: `${category} | ${TITLE}`,
        },
        pageTitle: `Catégorie ${category}`,
        category,
        articles: indexes
          .map((index) => articlesCache[index])
          .map(({ properties: { Name: name, Url: url } }) => ({
            url:
              url.type === "rich_text" &&
              richTextToString(url.rich_text as TextRichTextItemResponse[]),
            label: name.type === "title" && titlePropToString(name),
          })),
        ...sharedProps,
      } as CategoryTemplateContext,
    });
  });

  // 3.3. ARTICLES

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
          pageTitle: name.type === "title" && titlePropToString(name),
          head: {
            title: `${
              name.type === "title" && titlePropToString(name)
            } | ${TITLE}`,
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

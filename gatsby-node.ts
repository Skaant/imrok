import type { GatsbyNode } from "gatsby";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import path from "path";

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createPage } = actions;
  const res = await notion.databases.query({
    database_id: process.env.DATABASE_ID as string,
    filter: { property: "Contexte", select: { equals: "Page" } },
  });

  res.results.map((page) => {
    console.log(
      ((page as PageObjectResponse).properties["Name"] as any).title[0]
    );
    console.log(
      ((page as PageObjectResponse).properties["Name"] as any).title[0].text
        .content
    );
    createPage({
      component: path.resolve("./src/templates/default.template.tsx"),
      path: page.id,
      context: {
        title: ((page as PageObjectResponse).properties["Name"] as any).title[0]
          .text.content,
      },
    });
  });
};

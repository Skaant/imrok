import type { GatsbyNode } from "gatsby";

const { Client } = require("@notionhq/client");
console.log(process.env.NOTION_TOKEN);

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const createPages: GatsbyNode["createPages"] = async ({ actions }) => {
  const { createNode } = actions;
  const res = await notion.databases.retrieve({
    database_id: process.env.DATABASE_ID,
  });
};

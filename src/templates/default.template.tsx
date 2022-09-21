import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageProps } from "gatsby";
import React from "react";
import BlockSwitch from "../components/BlockSwitch";
import Layout from "../components/layout/Layout";
import "../styles/global.scss";

const DefaultTemplate = ({
  pageContext: { title, blocks },
}: PageProps<undefined, { title: string; blocks: BlockObjectResponse[] }>) => (
  <Layout>
    <>
      <div id="page-header" className="mb-5">
        <h1>{title}</h1>
      </div>
      {blocks.map((block) => (
        <BlockSwitch block={block} />
      ))}
    </>
  </Layout>
);

export default DefaultTemplate;

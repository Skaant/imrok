import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { PageProps } from "gatsby";
import React from "react";
import BlockSwitch from "../components/BlockSwitch";
import Layout from "../components/layout/Layout";
import "../styles/global.scss";

export type DefaultTemplateContext = {
  title: string;
  date: Date;
  blocks: BlockObjectResponse[];
};

const DefaultTemplate = ({
  pageContext: { title, date, blocks },
}: PageProps<undefined, DefaultTemplateContext>) => (
  <Layout>
    <>
      <div id="page-header" className="mb-5">
        <h1>{title}</h1>
      </div>
      {date && (
        <p>
          <>Créé le {new Date(date).toLocaleDateString("fr")}</>
        </p>
      )}
      {blocks.map((block) => (
        <BlockSwitch block={block} />
      ))}
    </>
  </Layout>
);

export default DefaultTemplate;

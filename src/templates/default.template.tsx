import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { PageProps } from "gatsby";
import React, { createContext } from "react";
import BlockSwitch from "../components/BlockSwitch";
import Layout from "../components/layout/Layout";
import { contentsState } from "../states/contents.state";
import "../styles/global.scss";

export type DefaultTemplateContext = {
  title: string;
  date: Date;
  blocks: BlockObjectResponse[];
  contents: PageObjectResponse[];
};

const DefaultTemplate = ({
  pageContext: { title, date, blocks, contents },
}: PageProps<undefined, DefaultTemplateContext>) => {
  contentsState.contents = contents;
  return (
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
};

export default DefaultTemplate;

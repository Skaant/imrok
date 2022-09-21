import {
  BlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { PageProps } from "gatsby";
import React from "react";
import ImageBlock from "../components/blocks/ImageBlock";
import ParagraphBlock from "../components/blocks/ParagraphBlock";
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
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return (
              <ParagraphBlock
                key={block.id}
                richTexts={
                  block.paragraph.rich_text as TextRichTextItemResponse[]
                }
              />
            );
          case "image": {
            return <ImageBlock block={block} />;
          }
        }
      })}
    </>
  </Layout>
);

export default DefaultTemplate;

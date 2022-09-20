import {
  BlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { PageProps } from "gatsby";
import React from "react";
import ImageBlock from "../components/blocks/ImageBlock";
import ParagraphBlock from "../components/blocks/ParagraphBlock";

const DefaultTemplate = ({
  pageContext: { title, blocks },
}: PageProps<undefined, { title: string; blocks: BlockObjectResponse[] }>) => (
  <div>
    <>
      <h1>{title}</h1>
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
  </div>
);

export default DefaultTemplate;

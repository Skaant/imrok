import {
  BlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import ImageBlock from "./blocks/ImageBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";

export default function BlockSwitch({ block }: { block: BlockObjectResponse }) {
  switch (block.type) {
    case "paragraph":
      return (
        <ParagraphBlock
          key={block.id}
          richTexts={block.paragraph.rich_text as TextRichTextItemResponse[]}
        />
      );
    case "image":
      return <ImageBlock block={block} />;
    default:
      return <></>;
  }
}

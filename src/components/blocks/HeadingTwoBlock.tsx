import {
  Heading2BlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import RichTextRenderer from "../RichTextRenderer";

export default function HeadingTwoBlock({
  block,
}: {
  block: Heading2BlockObjectResponse;
}) {
  return (
    <h2 className="mt-5 mb-4">
      <RichTextRenderer
        richTexts={block.heading_2.rich_text as TextRichTextItemResponse[]}
      />
    </h2>
  );
}

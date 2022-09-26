import {
  Heading3BlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import RichTextRenderer from "../RichTextRenderer";

export default function HeadingThreeBlock({
  block,
}: {
  block: Heading3BlockObjectResponse;
}) {
  return (
    <h2 className="mt-4 mb-3">
      <RichTextRenderer
        richTexts={block.heading_3.rich_text as TextRichTextItemResponse[]}
      />
    </h2>
  );
}

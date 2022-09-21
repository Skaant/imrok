import React from "react";
import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import RichTextRenderer from "../RichTextRenderer";

function ParagraphBlock({
  richTexts,
}: {
  richTexts: TextRichTextItemResponse[];
}): React.ReactElement {
  return (
    <p>
      <RichTextRenderer richTexts={richTexts} />
    </p>
  );
}

export default ParagraphBlock;

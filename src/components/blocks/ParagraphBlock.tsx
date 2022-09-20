import React from "react";
import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

function ParagraphBlock({
  richTexts,
}: {
  richTexts: TextRichTextItemResponse[];
}): React.ReactElement {
  return (
    <p>
      {richTexts.map(({ annotations, plain_text }) => {
        if (annotations.bold) {
          return <b>{plain_text}</b>;
        } else if (annotations.italic) {
          return <i>{plain_text}</i>;
        }
        return plain_text;
      })}
    </p>
  );
}

export default ParagraphBlock;

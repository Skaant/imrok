import React from "react";
import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

function RichTextRenderer({
  richTexts,
}: {
  richTexts: TextRichTextItemResponse[];
}): React.ReactElement {
  return (
    <>
      {richTexts.map(({ annotations, plain_text }) => {
        if (annotations.bold) {
          return <b>{plain_text}</b>;
        } else if (annotations.italic) {
          return <i>{plain_text}</i>;
        }
        return plain_text;
      })}
    </>
  );
}

export default RichTextRenderer;

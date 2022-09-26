import React from "react";
import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

function RichTextRenderer({
  richTexts,
}: {
  richTexts: TextRichTextItemResponse[];
}): React.ReactElement {
  return (
    <>
      {richTexts.map(({ annotations, plain_text, href }) => {
        if (annotations.bold) {
          return <b key={plain_text}>{plain_text}</b>;
        } else if (annotations.italic) {
          return <i key={plain_text}>{plain_text}</i>;
        } else if (href) {
          return (
            <a key={plain_text} href={href}>
              {plain_text}
            </a>
          );
        }
        return plain_text;
      })}
    </>
  );
}

export default RichTextRenderer;

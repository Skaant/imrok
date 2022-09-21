import {
  ImageBlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import RichTextRenderer from "../RichTextRenderer";

export default function ImageBlock({
  block,
}: {
  block: ImageBlockObjectResponse;
}) {
  return (
    <>
      {block.image.type === "external" ? (
        <img src={block.image.external.url} />
      ) : (
        <img src={block.image.file.url} />
      )}
      {block.image.caption && (
        <p className="small">
          <RichTextRenderer
            richTexts={block.image.caption as TextRichTextItemResponse[]}
          />
        </p>
      )}
    </>
  );
}

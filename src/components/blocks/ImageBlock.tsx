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
  const className = "mt-5 mb-4";
  return (
    <>
      {block.image.type === "external" ? (
        <img src={block.image.external.url} className={className} />
      ) : (
        <img src={block.image.file.url} className={className} />
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

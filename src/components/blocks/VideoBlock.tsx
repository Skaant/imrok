import {
  VideoBlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import RichTextRenderer from "../RichTextRenderer";

export default function VideoBlock({
  block,
}: {
  block: VideoBlockObjectResponse;
}) {
  return (
    <>
      {block.video.type === "external" ? (
        <iframe
          width="560"
          height="315"
          src={block.video.external.url.split("/watch?v=").join("/embed/")}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <></>
      )}
      {block.video.caption && (
        <p className="small">
          <RichTextRenderer
            richTexts={block.video.caption as TextRichTextItemResponse[]}
          />
        </p>
      )}
    </>
  );
}

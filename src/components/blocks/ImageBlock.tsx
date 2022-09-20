import { ImageBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import React from "react";

export default function ImageBlock({
  block,
}: {
  block: ImageBlockObjectResponse;
}) {
  const blockImage = block.image;
  if (blockImage.type === "external") {
    return <img src={blockImage.external.url} />;
  } else {
    return <img src={blockImage.file.url} />;
  }
}

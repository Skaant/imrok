import {
  BlockObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import { SPECIAL_BLOCKS } from "../enums/special-blocks.enum";
import { GlobalContext } from "../types/GlobalContext";
import HeadingThreeBlock from "./blocks/HeadingThreeBlock";
import HeadingTwoBlock from "./blocks/HeadingTwoBlock";
import ImageBlock from "./blocks/ImageBlock";
import ParagraphBlock from "./blocks/ParagraphBlock";
import VideoBlock from "./blocks/VideoBlock";
import SpecialBlockSwitch from "./SpecialBlockSwitch";

type BlockSwitchProps = GlobalContext & { block: BlockObjectResponse };

export default function BlockSwitch({ block, contents }: BlockSwitchProps) {
  switch (block.type) {
    case "paragraph":
      if (
        block.paragraph.rich_text[0] &&
        block.paragraph.rich_text[0].plain_text.startsWith("{")
      ) {
        return (
          <SpecialBlockSwitch
            block={
              block.paragraph.rich_text[0].plain_text
                .split("{")[1]
                .split("}")[0] as SPECIAL_BLOCKS
            }
            contents={contents}
          />
        );
      } else {
        return (
          <ParagraphBlock
            key={block.id}
            richTexts={block.paragraph.rich_text as TextRichTextItemResponse[]}
          />
        );
      }
    case "image":
      return <ImageBlock block={block} />;
    case "video":
      return <VideoBlock block={block} />;
    case "heading_2":
      return <HeadingTwoBlock block={block} />;
    case "heading_3":
      return <HeadingThreeBlock block={block} />;
    default:
      return <></>;
  }
}

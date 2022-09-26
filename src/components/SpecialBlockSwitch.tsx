import React from "react";
import { SPECIAL_BLOCKS } from "../enums/special-blocks.enum";
import { GlobalContext } from "../types/GlobalContext";
import ContentsList from "./blocks/ContentsList";

type SpecialBlockSwitchProps = GlobalContext & {
  block: SPECIAL_BLOCKS;
};

export default function SpecialBlockSwitch({
  block,
  contents,
}: SpecialBlockSwitchProps) {
  switch (block) {
    case SPECIAL_BLOCKS.CONTENT_LIST:
      return <ContentsList contents={contents} />;
  }
}

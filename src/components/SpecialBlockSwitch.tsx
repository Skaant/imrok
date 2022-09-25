import React from "react";
import { SPECIAL_BLOCKS } from "../enums/special-blocks.enum";
import ContentsList from "./blocks/ContentsList";

export default function SpecialBlockSwitch({
  block,
}: {
  block: SPECIAL_BLOCKS;
}) {
  console.log(block);
  switch (block) {
    case SPECIAL_BLOCKS.CONTENT_LIST:
      console.log("ai");
      return <ContentsList />;
  }
}

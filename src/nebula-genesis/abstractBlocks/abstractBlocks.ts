import { ExtendedBlockObjectResponse } from "statikon";
import {
  BulletedListBlockObject,
  NumberedListBlockObject,
} from "statikon/build/src/types/ExtendedBlockObjectResponse";

/**
 * Aims to group some **following base blocks** types
 *  to special blocks :
 * * Multiple *bulleted list items* to *bulleted list*,
 * * Multiple *numbered list items* to *numbered list*,
 * * (TODO) Multiple *images* to *carousel*,
 */
export default function abstractBlocks(blocks: ExtendedBlockObjectResponse[]) {
  return blocks.reduce((_blocks, block) => {
    const prevBlock = _blocks.pop();
    if (
      prevBlock?.type === "bulleted_list_item" &&
      block.type === "bulleted_list_item"
    ) {
      _blocks.push({
        id: Date.now().toString(),
        type: "bulleted_list",
        items: [prevBlock, block],
      } as BulletedListBlockObject);
    } else if (
      prevBlock?.type === "bulleted_list" &&
      block.type === "bulleted_list_item"
    ) {
      prevBlock.items.push(block);
      _blocks.push(prevBlock);
    } else if (
      prevBlock?.type === "numbered_list_item" &&
      block.type === "numbered_list_item"
    ) {
      _blocks.push({
        id: Date.now().toString(),
        type: "numbered_list",
        items: [prevBlock, block],
      } as NumberedListBlockObject);
    } else if (
      prevBlock?.type === "bulleted_list" &&
      block.type === "bulleted_list_item"
    ) {
      prevBlock.items.push(block);
      _blocks.push(prevBlock);
      /** @todo following images creates a carousel */
    } else {
      if (prevBlock) {
        _blocks.push(prevBlock);
      }
      _blocks.push(block as ExtendedBlockObjectResponse);
    }
    return _blocks;
  }, [] as ExtendedBlockObjectResponse[]);
}

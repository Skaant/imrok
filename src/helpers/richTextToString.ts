import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

function richTextToString(texts: TextRichTextItemResponse[]): string {
  return texts
    .map(({ plain_text }) => {
      return plain_text;
    })
    .join(" ");
}

export default richTextToString;

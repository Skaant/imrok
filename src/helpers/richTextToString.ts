import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

function richTextToString(texts: TextRichTextItemResponse[]): string {
  return texts
    .map(({ annotations, plain_text }) => {
      return plain_text;
    })
    .join(" ");
}

export default richTextToString;

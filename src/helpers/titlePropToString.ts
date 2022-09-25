import {
  RichTextItemResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

function titlePropToString({ title }: { title: RichTextItemResponse[] }) {
  return (title[0] as TextRichTextItemResponse).text.content;
}

export default titlePropToString;

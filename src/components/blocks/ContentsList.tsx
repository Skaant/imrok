import { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import React from "react";
import richTextToString from "../../helpers/richTextToString";
import titlePropToString from "../../helpers/titlePropToString";
import { contentsState } from "../../states/contents.state";

export default function ContentsList() {
  const { contents } = contentsState;
  return (
    <div className="mt-4 mb-5">
      <>
        {contents.map((content) => {
          const { ["Name"]: name, ["Url"]: url } = content.properties;
          return (
            <div>
              <a
                href={
                  url.type === "rich_text"
                    ? richTextToString(
                        url.rich_text as TextRichTextItemResponse[]
                      )
                    : content.id
                }
              >
                {name.type === "title" && titlePropToString(name)}
              </a>
            </div>
          );
        })}
      </>
    </div>
  );
}

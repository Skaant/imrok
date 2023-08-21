import "../styles/global.scss";
import React from "react";
import {
  CustomizableTemplate,
  CustomizableTemplateContext,
  Head,
} from "nebula-atoms";
import { PageProps } from "gatsby";
import LinksListWithCategory from "../components/LinksListWithCategory";
import { LinkWithCategory } from "../types/LinkWithCategory";

export type AllArticlesTemplateContext = CustomizableTemplateContext & {
  articlesLink: LinkWithCategory[];
};

const AllArticlesTemplate = ({
  pageContext: { articlesLink, ...props },
}: PageProps<undefined, AllArticlesTemplateContext>) => (
  <CustomizableTemplate
    {...props}
    staticBlocks={{
      ["tous-les-articles"]: <LinksListWithCategory links={articlesLink} />,
    }}
  />
);

export { Head };

export default AllArticlesTemplate;

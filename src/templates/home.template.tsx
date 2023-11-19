import "../styles/global.scss";
import React from "react";
import {
  CustomizableTemplate,
  CustomizableTemplateContext,
  Head,
  Link,
  LinksList,
} from "nebula-atoms";
import { PageProps } from "gatsby";
import LinksListWithCategory from "../components/LinksListWithCategory";
import { LinkWithCategory } from "../types/LinkWithCategory";
import Navbar from "../components/Navbar";

export type HomeTemplateContext = CustomizableTemplateContext & {
  lastArticlesLink: LinkWithCategory[];
  categoriesPageLink: Link[];
};

const HomeTemplate = ({
  pageContext: { lastArticlesLink, categoriesPageLink, ...props },
}: PageProps<undefined, HomeTemplateContext>) => (
  <CustomizableTemplate
    {...props}
    navbar={<Navbar />}
    staticBlocks={{
      ["derniers-articles"]: <LinksListWithCategory links={lastArticlesLink} />,
      ["toutes-les-categories"]: <LinksList links={categoriesPageLink} />,
    }}
  />
);

export { Head };

export default HomeTemplate;

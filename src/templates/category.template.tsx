import "../styles/global.scss";
import React from "react";
import {
  EmptyTemplate,
  EmptyTemplateContext,
  Head,
  Link,
  LinksList,
} from "nebula-atoms";
import { PageProps } from "gatsby";
import LinksListWithCategory from "../components/LinksListWithCategory";
import { LinkWithCategory } from "../types/LinkWithCategory";
import Navbar from "../components/Navbar";

export type CategoryTemplateContext = Omit<EmptyTemplateContext, "children"> & {
  category: string;
  articles: LinkWithCategory[];
};

const CategoryTemplate = ({
  pageContext: { category, articles, ...props },
}: PageProps<undefined, CategoryTemplateContext>) => (
  <EmptyTemplate {...props} navbar={<Navbar />}>
    <>
      <p>Tous les articles de la catégorie {category}</p>
      <LinksListWithCategory links={articles} />
    </>
  </EmptyTemplate>
);

export { Head };

export default CategoryTemplate;

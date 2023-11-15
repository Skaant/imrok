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

export type CategoryTemplateContext = Omit<EmptyTemplateContext, "children"> & {
  category: string;
  articles: Link[];
};

const CategoryTemplate = ({
  pageContext: { category, articles, ...props },
}: PageProps<undefined, CategoryTemplateContext>) => (
  <EmptyTemplate {...props}>
    <>
      <p>Tous les articles de la catégorie {category}</p>
      <LinksList links={articles} />
    </>
  </EmptyTemplate>
);

export { Head };

export default CategoryTemplate;

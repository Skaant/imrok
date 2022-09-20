import { PageProps } from "gatsby";
import React from "react";

const DefaultTemplate = ({
  pageContext: { title },
}: PageProps<undefined, { title: string }>) => <div>{title}</div>;

export default DefaultTemplate;

import React from "react";
import { PageProps } from "gatsby";
import "../styles/global.scss";
import { Head, DefaultTemplate as DefaultTemplateSource } from "nebula-atoms";
import { DefaultTemplateContext } from "nebula-atoms";
import Navbar from "../components/Navbar";

const DefaultTemplate = ({
  pageContext,
}: PageProps<undefined, DefaultTemplateContext>) => (
  <DefaultTemplateSource
    {...({
      pageContext: {
        ...pageContext,
        navbar: <Navbar />,
      },
    } as PageProps<undefined, DefaultTemplateContext>)}
  />
);

export { Head };

export default DefaultTemplate;

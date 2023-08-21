import { Link } from "gatsby";
import React from "react";
import { LinkWithCategory } from "../types/LinkWithCategory";

export default function LinksListWithCategory({
  links,
}: {
  links: LinkWithCategory[];
}) {
  return (
    <ul className="links-list-with-category">
      {links.map(({ url, label, category }) => (
        <li key={url}>
          <Link to={url}>
            <span>{category}</span>
            <span>{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

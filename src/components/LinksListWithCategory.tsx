import { Link } from "gatsby";
import React from "react";
import { LinkWithCategory } from "../types/LinkWithCategory";

const YEAR = new Date().getFullYear().toString();

export default function LinksListWithCategory({
  links,
}: {
  links: LinkWithCategory[];
}) {
  return (
    <ul className="links-list-with-category">
      {links.map(({ url, label, category, date }) => (
        <li key={url}>
          <Link to={url}>
            <span>{category}</span>
            {date && (
              <span>
                {(date.slice(0, 4) === YEAR
                  ? date.slice(5, 10)
                  : date.slice(0, 10)
                )
                  .split("-")
                  .reverse()
                  .join("/")}
              </span>
            )}
            <span>{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

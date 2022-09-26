import * as React from "react";
import { Link } from "gatsby";

function Footer() {
  return (
    <footer className="bg-psik text-highbs">
      <div className="d-flex justify-content-center flex-md-row flex-column text-white">
        <ul className="list-unstyled p-5 col-sm-12 col-md-6 col-xl-4">
          {[
            /** @todo Get content from configuration */
            {
              title: "Accueil",
              path: "/",
            },
          ].map(({ title, path }, index) => {
            return (
              <li className="py-1" key={index}>
                <Link className="pb-2" to={path}>
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="list-unstyled p-5 col-sm-12 col-md-6 col-xl-4">
          <li className="h3 py-2">{process.env.WEBSITE_TITLE}</li>
          <li className="py-2">
            Site développé par Romaric Ruga{" "}
            <a href="https://rimarok.com/">
              (freelance ingénierie web et éco-conception)
            </a>
            .
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;

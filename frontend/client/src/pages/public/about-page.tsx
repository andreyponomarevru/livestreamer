import * as React from "react";

import { FiGlobe } from "../../features/ui/icons";

import styles from "./about-page.module.css";

export function AboutPage(): React.ReactElement {
  const meta = { url: "http://www.kool97fm.com" };

  return (
    <main className={`${styles["about-page"]}`}>
      <h4>About</h4>
      <div className={styles["about-page__links"]}>
        <FiGlobe
          color="var(--color_charcoal-100)"
          className={styles["about-page__icon"]}
        />
        <a className="link" href={meta.url}>
          {meta.url}
        </a>
      </div>
      <div>Souls, Funk, Disco and Reggae music ALL DAY EVERYDAY.</div>
    </main>
  );
}

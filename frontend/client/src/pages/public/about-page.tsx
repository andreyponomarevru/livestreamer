import * as React from "react";

import styles from "./streams-page.module.css";

export function AboutPage(): React.ReactElement {
  return (
    <main
      className={`${styles["streams-page"]} ${styles["streams-page_list"]} page`}
    >
      <div className="page-box">
        <h4>About</h4>
        Souls, Funk, Disco and Reggae music ALL DAY EVERYDAY.
      </div>
    </main>
  );
}

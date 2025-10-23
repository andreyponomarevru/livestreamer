import * as React from "react";

import { About } from "../../features/about/about";

import styles from "./about-page.module.css";

export function AboutPage(): React.ReactElement {
  return (
    <div className={styles["about-page"]}>
      <About />
    </div>
  );
}

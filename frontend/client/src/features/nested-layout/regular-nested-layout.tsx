import * as React from "react";
import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar";

import styles from "./regular-nested-layout.module.css";
import commonStyles from "./nested-layout.module.css";

export function RegularNestedLayout(): React.ReactElement {
  return (
    <main
      className={`${commonStyles["nested-layout"]} ${styles["regular-nested-layout"]}`}
    >
      <Navbar className={styles["regular-nested-layout__navbar"]} />
      <div className={styles["regular-nested-layout__content"]}>
        <CurrentPageContent />
      </div>
    </main>
  );
}

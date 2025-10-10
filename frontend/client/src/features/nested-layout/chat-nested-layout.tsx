import * as React from "react";
import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar";

import commonStyles from "./nested-layout.module.css";
import styles from "./chat-nested-layout.module.css";

export function ChatNestedLayout(): React.ReactElement {
  return (
    <main
      className={`${commonStyles["nested-layout"]} ${styles["chat-nested-layout"]}`}
    >
      <Navbar className={styles["chat-nested-layout__navbar"]} />
      <CurrentPageContent />
    </main>
  );
}

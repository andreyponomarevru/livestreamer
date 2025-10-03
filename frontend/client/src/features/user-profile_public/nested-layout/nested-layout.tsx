import * as React from "react";
import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar";

import styles from "./nested-layout.module.css";

export function NestedLayout(): React.ReactElement {
  return (
    <div className="page-box">
      <div className={`${styles["nested-layout"]} page`}>
        <Navbar />
        <div className={`${styles["nested-layout__page-content"]}`}>
          <CurrentPageContent />
        </div>
      </div>
    </div>
  );
}

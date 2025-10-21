import { Outlet as CurrentPageContent } from "react-router";

import styles from "./child-layout-1.module.css";

export function ChildLayout1() {
  return (
    <div className={styles["child-layout-1"]}>
      <div
        className={`${styles["child-layout-1__content"]} ${styles["child-layout-1_margin-top"]} ${styles["child-layout-1_padded-top"]}`}
      >
        <CurrentPageContent />
      </div>
    </div>
  );
}

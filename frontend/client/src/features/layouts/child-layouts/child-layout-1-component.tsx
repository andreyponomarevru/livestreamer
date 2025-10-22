import { Outlet as CurrentPageContent } from "react-router";

import styles from "./child-layout-1.module.css";

export function ChildLayout1() {
  return (
    <div className={styles["child-layout-1"]}>
      <div className={styles["child-layout-1__content"]}>
        <CurrentPageContent />
      </div>
    </div>
  );
}

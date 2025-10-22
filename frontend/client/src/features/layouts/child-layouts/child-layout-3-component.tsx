import { Outlet as CurrentPageContent } from "react-router";

import styles from "./child-layout-3.module.css";

export function ChildLayout3() {
  return (
    <div className={styles["child-layout-3"]}>
      <div className={styles["child-layout-3__content"]}>
        <CurrentPageContent />
      </div>
    </div>
  );
}

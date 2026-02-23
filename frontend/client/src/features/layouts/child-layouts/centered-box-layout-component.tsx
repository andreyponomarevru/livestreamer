import { Outlet as CurrentPageContent } from "react-router";

import styles from "./centered-box-layout.module.css";

export function CenteredBoxLayout() {
  return (
    <div className={styles["centered-box-layout"]}>
      <CurrentPageContent />
    </div>
  );
}

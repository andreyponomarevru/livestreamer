import { Outlet as CurrentPageContent } from "react-router";

import styles from "./landing-layout-component.module.css";

export function LandingLayout() {
  return (
    <div className={styles["landing-layout"]}>
      <CurrentPageContent />
    </div>
  );
}

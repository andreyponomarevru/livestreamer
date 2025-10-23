import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar";

import styles from "./child-layout-2.module.css";

export function ChildLayout2() {
  return (
    <>
      {/*<div className={styles["background-image"]}></div>*/}
      <div className={styles["child-layout-2"]}>
        <div className={styles["child-layout-2__content"]}>
          <Navbar />
          <div className={styles["child-layout-2__body"]}>
            <CurrentPageContent />
          </div>
        </div>
      </div>
    </>
  );
}

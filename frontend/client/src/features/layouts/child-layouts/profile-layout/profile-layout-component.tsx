import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar-component";

import styles from "./profile-layout.module.css";

export function ProfileLayout() {
  return (
    <>
      {/*<div className={styles["background-image"]}></div>*/}
      <div className={styles["profile-layout"]}>
        <div className={styles["profile-layout__content"]}>
          <Navbar />
          <div className={styles["profile-layout__body"]}>
            <CurrentPageContent />
          </div>
        </div>
      </div>
    </>
  );
}

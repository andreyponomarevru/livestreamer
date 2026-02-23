import { Outlet as CurrentPageContent } from "react-router";

import { MySettingsNavbar } from "./my-settings-navbar-component";
import { Page } from "../../../ui";

import styles from "./my-settings-layout.module.css";

export function MySettingsLayout() {
  return (
    <div className={styles["my-settings-layout"]}>
      <Page>
        <MySettingsNavbar />
        <div className={styles["my-settings-layout__body"]}>
          <CurrentPageContent />
        </div>
      </Page>
    </div>
  );
}

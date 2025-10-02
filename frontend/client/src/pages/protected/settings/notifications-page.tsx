import * as React from "react";

import { NotificationsForm } from "../../../features/current-user_private";

import styles from "./notifications-page.module.css";

export function NotificationsPage(): React.ReactElement {
  return (
    <main className={`${styles["account-page"]} page`}>
      <div className="page-box">
        <h4 className="page-box__heading">Notification Settings</h4>
        <NotificationsForm />
      </div>
    </main>
  );
}

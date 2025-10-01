import * as React from "react";

import { AccountForm } from "../../../features/current-user/settings/components/account-form-component";

import styles from "./account-page.module.css";

export function AccountPage(): React.ReactElement {
  return (
    <main className={`${styles["account-page"]} page`}>
      <div className="page-box">
        <h4 className="page-box__heading">Account Settings</h4>
        <AccountForm />
      </div>
    </main>
  );
}

import * as React from "react";

import { AccountForm } from "../../../features/user-profile_protected/settings/components/account-form-component";

import styles from "./account-page.module.css";

export function AccountPage(): React.ReactElement {
  return (
    <main className={`${styles["account-page"]} page-box`}>
      <div className="page page_padded-top">
        <h4 className="page__heading">Account Settings</h4>
        <AccountForm />
      </div>
    </main>
  );
}

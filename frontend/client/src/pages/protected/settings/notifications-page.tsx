import * as React from "react";

import { NotificationsForm } from "../../../features/user-profile_protected";

export function NotificationsPage(): React.ReactElement {
  return (
    <main className="page-box">
      <div className="page page_padded-top">
        <h4 className="page__heading">Notification Settings</h4>
        <NotificationsForm />
      </div>
    </main>
  );
}

import * as React from "react";

import { NotificationsForm } from "../../../features/settings";

export function NotificationsPage(): React.ReactElement {
  return (
    <main className="page page_margin-top page_padded-top">
      <h4 className="page__heading">Notification Settings</h4>
      <NotificationsForm />
    </main>
  );
}

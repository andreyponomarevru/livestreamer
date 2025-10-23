import * as React from "react";

import { Page } from "../../features/ui/page/page-component";
import { NotificationsForm } from "../../features/settings";

export function NotificationsPage(): React.ReactElement {
  return (
    <Page>
      <h4 className="text-size-xl padding-bottom-m">Notification Settings</h4>
      <NotificationsForm />
    </Page>
  );
}

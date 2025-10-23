import * as React from "react";

import { Page } from "../../features/ui/page/page-component";
import { AccountForm } from "../../features/settings/components/account-form-component";

export function AccountPage(): React.ReactElement {
  return (
    <Page>
      <h4 className="text-size-xl padding-bottom-m">Account Settings</h4>
      <AccountForm />
    </Page>
  );
}

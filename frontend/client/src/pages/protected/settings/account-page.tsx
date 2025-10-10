import * as React from "react";

import { AccountForm } from "../../../features/settings/components/account-form-component";

export function AccountPage(): React.ReactElement {
  return (
    <main className="page page_margin-top page_padded-top">
      <h4 className="page__heading">Account Settings</h4>
      <AccountForm />
    </main>
  );
}

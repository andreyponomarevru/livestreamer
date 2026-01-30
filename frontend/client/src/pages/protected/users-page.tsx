import * as React from "react";

import { UserDetails } from "../../features/admin/users/components/user-details-component";
import { Loader } from "../../features/ui/loader/loader-component";
import { Message } from "../../features/ui/message/message-component";
import { useGetUsersQuery } from "../../features/admin/admin-slice";
import { Page } from "../../features/ui/page/page-component";

export function UsersPage(): React.ReactElement {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  return (
    <Page>
      <h4 className="text-size-xl padding-bottom-m">Users</h4>

      {isLoading && <Loader />}
      {isError && <Message type="warning">{String(error)}</Message>}
      {users?.map((user) => <UserDetails {...user} key={user.userId} />)}
    </Page>
  );
}

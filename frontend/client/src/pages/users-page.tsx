import * as React from "react";

import { PageHeading } from "../features/ui/page-heading/page-heading";
import { UserDetails } from "../features/moderation/users/components/user-details-component";
import { Loader } from "../features/ui/loader/loader";
import { Message } from "../features/ui/message/message";
import { useGetUsersQuery } from "../features/moderation/users/users-slice";

import "./users-page.scss";

function PagesUsers(): React.ReactElement {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  return (
    <div className="users-page">
      <PageHeading iconName="users" name="Users" />

      {isLoading && <Loader color="pink" />}
      {isError && <Message type="danger">{String(error)}</Message>}
      {users?.map((user) => <UserDetails {...user} key={user.id} />)}
    </div>
  );
}

export { PagesUsers };

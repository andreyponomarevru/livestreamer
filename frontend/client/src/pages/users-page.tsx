import * as React from "react";

import { PageHeading } from "../features/ui/page-heading/page-heading-component";
import { UserDetails } from "../features/moderation/users/components/user-details-component";
import { Loader } from "../features/ui/loader/loader-component";
import { Message } from "../features/ui/message/message-component";
import { useGetUsersQuery } from "../features/moderation/users/users-slice";

import styles from "./users-page.module.css";

export function UsersPage(): React.ReactElement {
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  return (
    <div className={styles["users-page"]}>
      <PageHeading iconName="users" name="Users" />

      {isLoading && <Loader />}
      {isError && <Message type="danger">{String(error)}</Message>}
      {users?.map((user) => <UserDetails {...user} key={user.id} />)}
    </div>
  );
}

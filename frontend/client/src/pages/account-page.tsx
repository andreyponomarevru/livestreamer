import * as React from "react";
import { useNavigate } from "react-router";

import { PageHeading } from "../features/ui/page-heading/page-heading-component";
import { AccountForm } from "../features/account-settings/account-form/account-form-component";
import { API_ROOT_URL } from "../config/env";
import { Message } from "../features/ui/message/message-component";
import { Btn } from "../features/ui/btn";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useFetch } from "../hooks/use-fetch";
import { Loader } from "../features/ui/loader/loader-component";
import { PATHS } from "../app/routes";
import { useAppSelector } from "../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../features/current-user";

import styles from "./account-page.module.css";

export function AccountPage(): React.ReactElement {
  function deleteAccount() {
    sendDeleteUserRequest(`${API_ROOT_URL}/user`, { method: "DELETE" });
  }

  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  const isMounted = useIsMounted();
  const { state: deleteUserResponse, fetchNow: sendDeleteUserRequest } =
    useFetch();
  React.useEffect(() => {
    if (isMounted && deleteUserResponse.response) {
      navigate(PATHS.root);
    }
  }, [isMounted, deleteUserResponse]);

  return (
    <div className={styles["account-page"]}>
      <PageHeading iconName="user" name="Account" />
      <AccountForm />
      <div className={styles["account-page__btns"]}>
        <Btn
          theme="quaternary"
          className={styles["account-page__delete-account-btn"]}
          handleClick={deleteAccount}
          isLoading={deleteUserResponse.isLoading}
        >
          Delete Account {deleteUserResponse.isLoading && <Loader />}
        </Btn>
        {deleteUserResponse.error && (
          <Message type="danger">{deleteUserResponse.error}</Message>
        )}
      </div>
    </div>
  );
}

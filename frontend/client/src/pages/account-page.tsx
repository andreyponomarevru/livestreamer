import * as React from "react";
import { useNavigate } from "react-router";

import { PageHeading } from "../features/ui";
import { AccountForm } from "../features/account-settings/account-form/account-form-component";
import { API_ROOT_URL } from "../config/env";
import { Message } from "../features/ui";
import { Btn } from "../features/ui";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useFetch } from "../hooks/use-fetch";
import { Loader } from "../features/ui";
import { PATHS } from "../app/routes";
import { useAppSelector } from "../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../features/current-user";

import "./account-page.scss";

export function PagesAccount(): React.ReactElement {
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
    <div className="account-page">
      <PageHeading iconName="user" name="Account" />
      <AccountForm />
      <div className="account-page__btns">
        <Btn
          theme="red"
          className="account-page__delete-account-btn"
          handleClick={deleteAccount}
          name="Delete Account"
          isLoading={deleteUserResponse.isLoading}
        >
          <Loader for="btn" color="black" />
        </Btn>
        {deleteUserResponse.error && (
          <Message type="danger">{deleteUserResponse.error}</Message>
        )}
      </div>
    </div>
  );
}

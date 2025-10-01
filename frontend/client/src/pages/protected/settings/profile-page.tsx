import * as React from "react";
import { useNavigate } from "react-router";

import { ProfileForm } from "../../../features/current-user";
import { API_ROOT_URL } from "../../../config/env";
import { Message } from "../../../features/ui/message/message-component";
import { Btn } from "../../../features/ui/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { Loader } from "../../../features/ui/loader/loader-component";
import { PATHS } from "../../../app/routes";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/current-user";

import styles from "./profile-page.module.css";

export function ProfilePage(): React.ReactElement {
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
    <main className={`${styles["profile-page"]} page`}>
      <div className="page-box">
        <h4 className="page-box__heading">Profile Settings</h4>
        <ProfileForm />
      </div>
    </main>
  );
}

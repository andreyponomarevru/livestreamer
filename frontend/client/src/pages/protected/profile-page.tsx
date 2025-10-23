import * as React from "react";
import { useNavigate } from "react-router";

import { Page } from "../../features/ui/page/page-component";
import { ProfileForm } from "../../features/settings";
import { API_ROOT_URL } from "../../config/env";
import { Message } from "../../features/ui/message/message-component";
import { Btn } from "../../features/ui/btn";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useFetch } from "../../hooks/use-fetch";
import { Loader } from "../../features/ui/loader/loader-component";
import { PATHS } from "../../config/constants";
import { useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../features/auth";

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
    <Page>
      <h4 className="text-size-xl padding-bottom-m">Profile Settings</h4>
      <ProfileForm />
    </Page>
  );
}

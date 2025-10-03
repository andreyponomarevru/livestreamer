import * as React from "react";
import { NavLink, useNavigate } from "react-router";

import { useQuery } from "../../../hooks/use-query";
import { Message } from "../../../features/ui/message/message-component";
import { API_ROOT_URL } from "../../../config/env";
import { Loader } from "../../../features/ui/loader/loader-component";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { Help } from "../../../features/ui/help/help-component";
import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/user-profile_protected/current-user-slice";
import { PiSmileySad } from "../../../features/ui/icons";

import styles from "./confirm-registration-page.module.css";

export function ConfirmRegistrationPage(): React.ReactElement {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  });

  const query = useQuery();
  const token = query.get("token");

  const isMounted = useIsMounted();

  const { state: confirmSignUpResponse, fetchNow: sendTokenRequest } =
    useFetch();
  React.useEffect(() => {
    if (isMounted && token) {
      console.log("[confirmSignUp] Sending confirmation request...");

      sendTokenRequest(`${API_ROOT_URL}/verification?token=${token}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted, token]);

  const [isConfirmed, setIsConfirmed] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    if (isMounted && confirmSignUpResponse.response) {
      setIsConfirmed(true);
    } else if (isMounted && confirmSignUpResponse.error) {
      setIsConfirmed(false);
    }
  }, [isMounted, confirmSignUpResponse]);

  return (
    <main className={styles["confirm-registration-page"]}>
      <div className={styles["confirm-registration-page__box"]}>
        {isConfirmed === false && (
          <React.Fragment>
            <PiSmileySad
              fill="var(--color_danger)"
              className={styles["confirm-registration-page__icon"]}
            />
            <span className={styles["confirm-registration-page__message"]}>
              Sorry, we couldn't verify your email
            </span>
            <Help />
          </React.Fragment>
        )}

        {isConfirmed === true && (
          <Message type="success">
            <div className={styles["circle circle_green page__circle"]}>
              Done! Now, you can <NavLink to={PATHS.signIn}>log in</NavLink>.
            </div>
          </Message>
        )}

        {confirmSignUpResponse.isLoading && <Loader />}
      </div>
    </main>
  );
}

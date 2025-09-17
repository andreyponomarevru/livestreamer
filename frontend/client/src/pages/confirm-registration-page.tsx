import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { useQuery } from "../hooks/use-query";
import { Message } from "../features/ui/message/message-component";
import { API_ROOT_URL } from "../config/env";
import { Loader } from "../features/ui/loader/loader-component";
import { useIsMounted } from "../hooks/use-is-mounted";
import { useFetch } from "../hooks/use-fetch";
import { Help } from "../features/ui/help/help-component";
import { PATHS } from "../app/routes";
import { useAppSelector } from "../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../features/current-user/current-user-slice";

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
    <div className={styles["confirm-registration-page"]}>
      {isConfirmed === false && (
        <React.Fragment>
          <Message type="danger">{`Sorry, we couldn't verify your email :(`}</Message>
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
  );
}

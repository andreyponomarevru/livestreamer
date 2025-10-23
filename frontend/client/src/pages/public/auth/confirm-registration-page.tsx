import * as React from "react";
import { NavLink, useNavigate } from "react-router";

import { useQuery } from "../../../hooks/use-query";
import { API_ROOT_URL } from "../../../config/env";
import { Loader } from "../../../features/ui/loader/loader-component";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { Help } from "../../../features/ui/help/help-component";
import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/auth";
import { PiSmileySad, PiSmiley } from "../../../features/ui/icons";
import { Box } from "../../../features/ui/box/box-component";

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
    <Box>
      {isConfirmed === false && (
        <>
          <PiSmileySad fill="var(--color_danger)" className="icon-size-m" />
          <span className="text-size-xl text-color-warning">
            Sorry, we couldn't verify your email
          </span>
          <Help />
        </>
      )}

      {isConfirmed === true && (
        <>
          <PiSmiley fill="var(--color_success)" className="icon-size-m" />
          <div className="text-size-xl text-color-success">
            <p>Done!</p>
            <p>
              Now, you can{" "}
              <NavLink to={PATHS.signIn} className="link">
                log in
              </NavLink>
              .
            </p>
          </div>
        </>
      )}

      {confirmSignUpResponse.isLoading && <Loader />}
    </Box>
  );
}

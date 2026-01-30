import * as React from "react";
import { NavLink, useNavigate } from "react-router";

import { useQuery } from "../../../hooks/use-query";
import { Loader } from "../../../features/ui/loader/loader-component";
import { Help } from "../../../features/ui/help/help-component";
import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import {
  selectCurrentUserProfile,
  useSendConfirmationTokenMutation,
} from "../../../features/auth";
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

  const [
    sendConfirmationToken,
    {
      isError: isSendTokenError,
      isLoading: isSendTokenLoading,
      isSuccess: isSendTokenSuccess,
    },
  ] = useSendConfirmationTokenMutation();
  React.useEffect(() => {
    if (token) sendConfirmationToken(token);
  }, [token, sendConfirmationToken]);

  if (isSendTokenSuccess) {
    return (
      <Box>
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
      </Box>
    );
  }

  if (isSendTokenError) {
    return (
      <Box>
        <PiSmileySad fill="var(--color_danger)" className="icon-size-m" />
        <span className="text-size-xl text-color-warning">
          Sorry, we couldn't verify your email
        </span>
        <Help />
      </Box>
    );
  }

  return <Box>{isSendTokenLoading && <Loader />}</Box>;
}

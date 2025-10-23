import * as React from "react";
import { useNavigate } from "react-router";

import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/auth/current-user-slice";
import { Box } from "../../../features/ui/box/box-component";

export function AskToConfirmRegistrationPage(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  }, []);

  return (
    <Box>
      <h1 className="text-size-xl font-weight-semibold text-color-success">
        Almost done.
        <br />
        Check your mailbox
      </h1>
      <p>
        We have sent an email with a confirmation link to your email address. In
        order to complete the registration process, please click the
        confirmation link.
      </p>
      <p>
        If you do not receive a confirmation email, please check your spam
        folder.
      </p>
    </Box>
  );
}

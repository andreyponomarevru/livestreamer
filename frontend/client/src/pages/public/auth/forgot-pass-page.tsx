import React from "react";
import { useNavigate } from "react-router";

import { PasswordRecoveryForm } from "../../../features/auth";
import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/auth";

export function ForgotPassPage(): React.ReactElement {
  const navigate = useNavigate();

  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  });

  return <PasswordRecoveryForm />;
}

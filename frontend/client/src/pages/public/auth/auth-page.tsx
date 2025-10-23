import React from "react";
import { useNavigate } from "react-router";

import { AuthToggle } from "../../../features/auth";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/auth";
import { PATHS } from "../../../config/constants";

export function AuthPage(): React.ReactElement | null {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);

  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  }, [user, navigate]);

  return user ? null : <AuthToggle />;
}

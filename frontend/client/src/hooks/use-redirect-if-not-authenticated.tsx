import * as React from "react";
import { useNavigate } from "react-router";

import { PATHS } from "../config/constants";
import { selectCurrentUserProfile } from "../features/current-user_private/current-user-slice";
import { useAppSelector } from "./redux-ts-helpers";

export function useRedirectIfNotAuthenticated(): void {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);

  React.useEffect(() => {
    if (!user) navigate(PATHS.signIn);
    else navigate(PATHS.root);
  }, [user, navigate]);
}

import * as React from "react";
import { useNavigate } from "react-router";

import { PATHS } from "../app/routes";
import { selectCurrentUserProfile } from "../features/current-user/current-user-slice";
import { useAppSelector } from "./redux-ts-helpers";

export function useRedirectIfNotAuthenticated(): void {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);

  React.useEffect(() => {
    if (!user) navigate(PATHS.signIn);
    else navigate(PATHS.root);
  }, [user, navigate]);
}

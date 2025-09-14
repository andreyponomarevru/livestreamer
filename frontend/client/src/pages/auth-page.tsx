import React from "react";

import { AuthBox } from "../features/current-user";
import { useAppSelector } from "../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../features/current-user/current-user-slice";
import { useNavigate } from "react-router";
import { PATHS } from "../app/routes";

import "./auth-page.scss";

export function PagesAuth(): React.ReactElement | null {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);

  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  }, [user, navigate]);

  return user ? null : (
    <div className="auth-page">
      <AuthBox />
    </div>
  );
}

import React from "react";
import { useNavigate } from "react-router";

import { AuthToggle } from "../../../features/current-user_private";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/current-user_private/current-user-slice";
import { PATHS } from "../../../config/constants";

import styles from "./auth-page.module.css";

export function AuthPage(): React.ReactElement | null {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);

  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  }, [user, navigate]);

  return user ? null : (
    <main className={styles["auth-page"]}>
      <AuthToggle />
    </main>
  );
}

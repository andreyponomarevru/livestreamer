import React from "react";
import { useNavigate } from "react-router";

import { AuthToggle } from "../../../features/current-user";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/current-user/current-user-slice";
import { PATHS } from "../../../app/routes";

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

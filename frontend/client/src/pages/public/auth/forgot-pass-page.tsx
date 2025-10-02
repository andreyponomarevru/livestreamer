import React from "react";
import { useNavigate } from "react-router";

import { PasswordRecovery } from "../../../features/current-user_private";
import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/current-user_private/current-user-slice";

import styles from "./forgot-pass-page.module.css";

export function ForgotPassPage(): React.ReactElement {
  const navigate = useNavigate();

  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  });

  return (
    <main className={styles["forgot-pass-page"]}>
      <PasswordRecovery />
    </main>
  );
}

import React from "react";

import { useNavigate } from "react-router-dom";
import { ForgotPassBox } from "../features/current-user/components/forgot-pass/forgot-pass-box-component";
import { PATHS } from "../app/routes";
import { useAppSelector } from "../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../features/current-user/current-user-slice";

import styles from "./forgot-pass-page.module.css";

export function ForgotPassPage(): React.ReactElement {
  const navigate = useNavigate();

  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  });

  return (
    <div className={styles["forgot-pass-page"]}>
      <ForgotPassBox />
    </div>
  );
}

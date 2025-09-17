import * as React from "react";
import { useNavigate } from "react-router";

import { PATHS } from "../app/routes";
import { useAppSelector } from "../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../features/current-user/current-user-slice";

import styles from "./ask-to-confirm-registration-page.module.css";

export function AskToConfirmRegistrationPage(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  }, []);

  return (
    <div className={styles["ask-to-confirm-registration-page page_box"]}>
      <h1 className={styles["ask-to-confirm-registration-page__heading"]}>
        Almost done.
        <br />
        Check your mailbox
      </h1>

      <p className={styles["confirm-registration-page__main"]}>
        We have sent an email with a confirmation link to your email address. In
        order to complete the registration process, please click the
        confirmation link.
      </p>

      <p>
        If you do not receive a confirmation email, please check your spam
        folder.
      </p>
    </div>
  );
}

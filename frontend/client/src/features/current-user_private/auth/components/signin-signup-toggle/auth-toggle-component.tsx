import * as React from "react";

import { SignInForm } from "./signin-form-component";
import { RegisterForm } from "./register-form-component";

import styles from "./auth-toggle.module.css";

export function AuthToggle() {
  const [isCompVisible, setIsCompVisible] = React.useState(true);

  const activeSignInClassName = isCompVisible
    ? styles["auth-toggle__header-link_active"]
    : "";

  const activeSignUpClassName = !isCompVisible
    ? styles["auth-toggle__header-link_active"]
    : "";

  return (
    <div className={styles["auth-toggle"]}>
      <header className={styles["auth-toggle__header"]}>
        <div className={styles["auth-toggle__header-link-wrapper"]}></div>
        <span
          className={`${styles["auth-toggle__header-link"]} ${activeSignInClassName}`}
          onClick={() => setIsCompVisible(true)}
        >
          <span className={styles["auth-toggle__header-link-text"]}>Login</span>
          <span className={styles["auth-toggle__header-link-bg"]}></span>
        </span>

        <span
          className={`${styles["auth-toggle__header-link"]} ${activeSignUpClassName}`}
          onClick={() => setIsCompVisible(false)}
        >
          <span className={styles["auth-toggle__header-link-text"]}>Join</span>
          <span className={styles["auth-toggle__header-link-bg"]}></span>
        </span>
      </header>

      {isCompVisible ? (
        <SignInForm className={styles["auth-toggle__box"]} />
      ) : (
        <RegisterForm className={styles["auth-toggle__box"]} />
      )}
    </div>
  );
}

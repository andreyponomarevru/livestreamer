import * as React from "react";

import { SignInForm } from "./signin-form-component";
import { RegisterForm } from "./register-form-component";

import styles from "./auth-toggle.module.css";

export function AuthToggle() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const activeSignInClassName =
    activeIndex === 0 ? styles["auth-toggle__header-link_active"] : "";

  const activeSignUpClassName =
    activeIndex === 1 ? styles["auth-toggle__header-link_active"] : "";

  return (
    <div className={styles["auth-toggle"]}>
      <header className={styles["auth-toggle__header"]}>
        <span
          className={`${styles["auth-toggle__header-link"]} ${activeSignInClassName}`}
          onClick={() => setActiveIndex(0)}
        >
          <span className={styles["auth-toggle__header-link-text"]}>Login</span>
          <span className={styles["auth-toggle__header-link-bg"]}></span>
        </span>

        <span
          className={`${styles["auth-toggle__header-link"]} ${activeSignUpClassName}`}
          onClick={() => setActiveIndex(1)}
        >
          <span className={styles["auth-toggle__header-link-text"]}>Join</span>
          <span className={styles["auth-toggle__header-link-bg"]}></span>
        </span>
      </header>

      {activeIndex === 0 && (
        <SignInForm className={styles["auth-toggle__box"]} />
      )}
      {activeIndex === 1 && (
        <RegisterForm className={styles["auth-toggle__box"]} />
      )}
    </div>
  );
}

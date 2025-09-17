import React from "react";

import { PassResetBox } from "../features/current-user";

import styles from "./pass-reset-page.module.css";

export function PassResetPage(): React.ReactElement {
  return (
    <div
      className={`${
        styles["pass-reset-page"]
      } ${styles["pass-reset-page_box"]}`}
    >
      <PassResetBox />
    </div>
  );
}

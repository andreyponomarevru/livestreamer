import * as React from "react";

import styles from "./form-error.module.css";

export function FormError(props: React.HTMLAttributes<React.ReactElement>) {
  return (
    <div className={`${styles["form-error"]} ${props.className || ""}`}>
      {props.children || "Something went wrong :("}
    </div>
  );
}

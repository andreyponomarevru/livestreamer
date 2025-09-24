import * as React from "react";

import { Message } from "../message/message-component";

import styles from "./form-error.module.css";

export function FormError(props: React.HTMLAttributes<React.ReactElement>) {
  return (
    <Message
      type="danger"
      className={`${styles["form-error"]} ${props.className || ""}`}
    >
      {props.children || "Something went wrong :("}
    </Message>
  );
}

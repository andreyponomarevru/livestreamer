import React from "react";

import styles from "./message.module.css";

interface Props {
  className?: string;
  type: "warning" | "success" | "info" | "danger" | "info" | "disabled";
}

export function Message(
  props: React.PropsWithChildren<Props>,
): React.ReactElement {
  return (
    <span
      className={`${styles.message} ${styles[`message_${props.type}`]} ${props.className || ""}`}
    >
      {props.children}
    </span>
  );
}

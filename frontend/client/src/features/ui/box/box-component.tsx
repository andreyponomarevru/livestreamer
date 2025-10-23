import * as React from "react";

import styles from "./box.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

export function Box(props: Props) {
  return (
    <div className={`${styles["box"]} ${props.className || ""}`}>
      {props.heading && (
        <h1 className={styles["box__header"]}>{props.heading}</h1>
      )}
      {props.children}
    </div>
  );
}

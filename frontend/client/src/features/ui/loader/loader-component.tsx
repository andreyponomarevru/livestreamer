import React from "react";

import styles from "./loader.module.css";

export function Loader(
  props: React.HTMLAttributes<HTMLSpanElement>,
): React.ReactElement {
  return (
    <span
      className={`${styles["loader"]} ${styles["loader_blink"]} ${props.className || ""}`}
    ></span>
  );
}

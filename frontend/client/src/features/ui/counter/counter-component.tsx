import React from "react";

import { ListenersIcon } from "../icons";

import styles from "./counter.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  isVisible: boolean;
}

export function Counter(props: Props): React.ReactElement | null {
  return (
    <div
      className={`counter ${props.isVisible ? "" : styles.counter_disabled}`}
    >
      <span className={styles.counter__number}>{props.count}</span>
      <ListenersIcon className={styles.counter__icon} />
    </div>
  );
}

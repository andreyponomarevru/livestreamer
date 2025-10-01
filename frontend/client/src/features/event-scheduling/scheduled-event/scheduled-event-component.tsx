import React from "react";

import styles from "./scheduled-event.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  startAt: string;
  endAt: string;
}

export function ScheduledEvent(props: Props): React.ReactElement {
  return (
    <li className={`${styles["scheduled-event"]} ${props.className || ""}`}>
      <span className={styles["scheduled-event__start"]}>{props.startAt}</span>
      <span>—</span>
      <span className={styles["scheduled-event__end"]}>{props.endAt}</span>
    </li>
  );
}

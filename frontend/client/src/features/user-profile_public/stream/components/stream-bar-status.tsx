import React from "react";

import styles from "./stream-bar-status.module.css";

import { Clock } from "./clock";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  startAt?: string;
}

export function StreamBarState(props: Props) {
  const dotClassName = props.startAt
    ? styles["stream-bar-status__dot_online"]
    : styles["stream-bar-status__dot_offline"];

  return (
    <div className={styles["stream-bar-status"]}>
      <div className={styles["stream-bar-status__status"]}>
        <div
          className={`${styles["stream-bar-status__dot"]} ${dotClassName}`}
        ></div>
        <div className={styles["stream-bar-status__text"]}>
          {props.startAt ? "LIVE" : "OFFLINE"}
        </div>
      </div>
      {props.startAt && (
        <Clock
          className={styles["stream-bar-status__clock"]}
          startAt={props.startAt}
        />
      )}
    </div>
  );
}

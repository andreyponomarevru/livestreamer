import React from "react";

import { useStreamTimer } from "../hooks/use-stream-timer";

import styles from "./clock.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  startAt: string;
  className?: string;
}

export function Clock(props: Props) {
  const timePassed = useStreamTimer(props.startAt);

  return (
    <span className={`${styles["clock"]} ${props.className}`}>
      {timePassed}
    </span>
  );
}

import React, { ReactElement } from "react";

import { useStreamTimer } from "../hooks/use-stream-timer";

import "./clock.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  startAt: string;
  className?: string;
}

export function Clock(props: Props): ReactElement {
  const timePassed = useStreamTimer(props.startAt);

  return <span className={`clock ${props.className}`}>{timePassed}</span>;
}

import React, { ReactElement } from "react";

import "./stream-bar-status.scss";

import { Clock } from "./clock";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  startAt?: string;
}

export function StreamBarState(props: Props): ReactElement {
  const dotClassName = props.startAt
    ? "stream-bar-status__dot_online"
    : "stream-bar-status__dot_offline";

  return (
    <div className="stream-bar-status">
      <div className="stream-bar-status__status">
        <div className={`stream-bar-status__dot ${dotClassName}`}></div>
        <div className="stream-bar-status__text">
          {props.startAt ? "LIVE" : "OFFLINE"}
        </div>
      </div>
      {props.startAt && (
        <Clock className="stream-bar-status__clock" startAt={props.startAt} />
      )}
    </div>
  );
}

import React from "react";

import "./scheduled-event.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  startAt: string;
  endAt: string;
}

export function ScheduledEvent(props: Props): React.ReactElement {
  return (
    <li className={`scheduled-event ${props.className || ""}`}>
      <span className="scheduled-event__start">{props.startAt}</span>
      <span>—</span>
      <span className="scheduled-event__end">{props.endAt}</span>
    </li>
  );
}

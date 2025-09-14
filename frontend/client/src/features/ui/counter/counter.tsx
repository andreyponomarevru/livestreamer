import React from "react";

import { Icon } from "../icon/icon";
import "./counter.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  count: number;
  icon: "heart" | "users";
  isVisible: boolean;
}

export function Counter(props: Props): React.ReactElement | null {
  return (
    <div className={`counter ${props.isVisible ? "" : "counter_disabled"}`}>
      <span className="counter__number">{props.count}</span>
      <Icon
        name={props.icon}
        color="white"
        className="counter__icon default-icon"
      />
    </div>
  );
}

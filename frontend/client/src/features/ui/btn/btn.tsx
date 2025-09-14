import * as React from "react";

import "./btn.scss";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  handleClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  name: string;
  theme: "white" | "red";
  isLoading?: boolean;
}

function Btn(props: Props): React.ReactElement {
  const className = `btn btn_theme_${props.theme} ${props.className || ""} ${
    props.isLoading ? "btn_disabled" : ""
  }`;

  return (
    <button
      onClick={props.handleClick ? props.handleClick : undefined}
      className={className}
      disabled={props.isLoading}
    >
      <span>{props.name}</span>
      {props.isLoading && props.children}
    </button>
  );
}

export { Btn };

import React from "react";

import "./loader.scss";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  color: "white" | "black" | "pink";
}

export function Loader(props: Props): React.ReactElement {
  return (
    <span
      className={`loader loader_blink loader_color_${props.color} ${props.className || ""}`}
    ></span>
  );
}

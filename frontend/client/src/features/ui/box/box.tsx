import * as React from "react";

import "./box.scss";

function Box(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`box ${props.className || ""}`}>{props.children}</div>;
}

export { Box };

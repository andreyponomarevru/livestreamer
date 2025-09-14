import React from "react";

interface Props {
  className?: string;
  type: "warning" | "success" | "info" | "danger" | "info" | "disabled";
}

export function Message(
  props: React.PropsWithChildren<Props>,
): React.ReactElement {
  return (
    <span className={`message message_${props.type} ${props.className || ""}`}>
      {props.children}
    </span>
  );
}

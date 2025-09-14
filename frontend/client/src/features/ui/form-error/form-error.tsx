import * as React from "react";

import { Message } from "../message/message";

import "./form-error.scss";

function FormError(props: React.HTMLAttributes<React.ReactElement>) {
  return (
    <Message type="danger" className={`form-error ${props.className || ""}`}>
      {props.children || "Something went wrong :("}
    </Message>
  );
}

export { FormError };

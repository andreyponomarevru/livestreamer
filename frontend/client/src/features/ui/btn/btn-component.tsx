import * as React from "react";

import styles from "./btn.module.css";
import { type CommonProps } from "./common-props";

interface Props extends CommonProps, React.HTMLAttributes<HTMLSpanElement> {
  handleClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  name?: string;
}

export function Btn(props: Props): React.ReactElement {
  const themeClass = styles[`btn_theme_${props.theme || "primary"}`];

  const className = `${styles.btn} ${themeClass} ${props.className || ""}`;

  return (
    <button
      onClick={props.handleClick ? props.handleClick : undefined}
      className={className}
      disabled={props.isLoading}
      name={props.name}
    >
      {props.children}
    </button>
  );
}

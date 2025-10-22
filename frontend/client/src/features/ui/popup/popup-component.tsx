import React from "react";

import styles from "./popup.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

export function Popup(props: Props) {
  return (
    <div
      className={`${styles["popup"]} ${
        props.isOpen ? styles["popup_open"] : ""
      } ${props.className}`}
    >
      {props.children}
    </div>
  );
}

import React from "react";

import icons from "./../../../assets/icons.svg";
import styles from "./chat-icon-btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  icon: "like" | "trash-can";
  isActive?: boolean;
}

export function ChatIconBtn(props: Props): React.ReactElement {
  return (
    <button
      className={`${styles["chat-icon-btn"]} ${props.className || ""}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="heart"
      value=""
    >
      <svg
        className={`${styles["chat-icon-btn__icon"]} ${
          props.isActive ? styles["chat-icon-btn__icon_active"] : ""
        } default-icon`}
      >
        <use href={`${icons}#${props.icon}`} />
      </svg>
    </button>
  );
}

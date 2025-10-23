import React from "react";

import { AiFillLike } from "../../../../ui/icons";

import styles from "./btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  isLiked?: boolean;
  likesCount: number;
}

export function LikeBtn(props: Props): React.ReactElement {
  return (
    <button
      className={`${styles["btn"]} ${props.isLiked ? styles["btn_active"] : ""} ${props.className || ""}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="like"
      value=""
    >
      <AiFillLike />
      {props.likesCount > 0 && (
        <span className={styles["btn__text"]}>{props.likesCount}</span>
      )}
    </button>
  );
}

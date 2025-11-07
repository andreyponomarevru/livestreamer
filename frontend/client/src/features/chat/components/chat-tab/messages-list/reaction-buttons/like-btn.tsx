import React from "react";

import { AiFillLike } from "../../../../../ui/icons";

import styles from "./btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
  isLikedByMe: boolean;
  likesCount: number;
}

export function LikeBtn(props: Props): React.ReactElement {
  let likedClassName = "";
  if (props.likesCount > 0) {
    likedClassName = styles["btn_liked"];
  }
  if (props.likesCount > 0 && props.isLikedByMe) {
    likedClassName = styles["btn_liked-by-me"];
  }

  return (
    <button
      className={`${styles["btn"]} ${likedClassName} ${props.className || ""}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="like"
      value=""
    >
      <AiFillLike />
      {props.likesCount > 0 && <span>{props.likesCount}</span>}
    </button>
  );
}

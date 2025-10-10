import React from "react";

import { BiSolidTrashAlt } from "../../../ui/icons";

import styles from "./btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleBtnClick: () => void;
}

export function DeleteBtn(props: Props): React.ReactElement {
  return (
    <button
      className={`${styles["btn"]} ${props.className || ""}`}
      onClick={props.handleBtnClick}
      type="submit"
      name="delete"
      value=""
    >
      <BiSolidTrashAlt />
    </button>
  );
}

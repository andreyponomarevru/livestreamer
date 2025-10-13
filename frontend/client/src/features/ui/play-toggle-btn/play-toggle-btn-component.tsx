import React from "react";

import { usePlayer } from "../../player";
import { API_ROOT_URL } from "../../../config/env";
import { FaCirclePlay, FaCirclePause } from "../icons";

import icons from "../../../assets/icons.svg";
import styles from "./play-toggle-btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function PlayToggleBtn(props: Props): React.ReactElement {
  const { isPlaying, togglePlay } = usePlayer(`${API_ROOT_URL}/stream`);

  return (
    <button
      id="playstream"
      disabled={!props.isStreamOnline}
      className={`${styles["play-toggle-btn"]} ${
        props.isStreamOnline ? "" : styles["play-toggle-btn_disabled"]
      } ${props.className}`}
      onClick={togglePlay}
    >
      {isPlaying ? (
        <FaCirclePause
          className={`${styles["play-toggle-btn__icon"]} default-icon`}
        />
      ) : (
        <FaCirclePlay
          className={`${styles["play-toggle-btn__icon"]} default-icon`}
        />
      )}
    </button>
  );
}

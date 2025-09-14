import React from "react";

import { usePlayer } from "../../stream/hooks/use-player";
import { API_ROOT_URL } from "../../../config/env";

import icons from "../../../assets/icons.svg";
import "./play-toggle-btn.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function PlayToggleBtn(props: Props): React.ReactElement {
  const { isPlaying, togglePlay } = usePlayer(`${API_ROOT_URL}/stream`);

  return (
    <button
      id="playstream"
      disabled={!props.isStreamOnline}
      className={`play-toggle-btn ${
        props.isStreamOnline ? "" : "play-toggle-btn_disabled"
      }`}
      onClick={togglePlay}
    >
      <svg className="play-toggle-btn__icon default-icon">
        <use href={`${icons}#${isPlaying ? "pause" : "play"}`} />
      </svg>
    </button>
  );
}

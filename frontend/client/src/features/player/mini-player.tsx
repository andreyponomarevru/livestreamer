import * as React from "react";

import { PlayToggleBtn } from "../ui/play-toggle-btn/play-toggle-btn-component";
import { type BroadcastState, type ClientCount } from "../../types";
import { HeartIcon, ListenersIcon } from "../ui/icons";

import styles from "./mini-player.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: {
    timePassed: string;
    state: BroadcastState; // TODO: add the 'about' field
    coverURL: string;
  };
  wsClientCount: ClientCount;
  isBackgroundImgShown?: boolean;
}

export function MiniPlayer(props: Props): React.ReactElement {
  console.log("component rerenders");

  return (
    <section
      className={`${styles["player"]} ${props.className || ""}`}
      style={
        props.isBackgroundImgShown
          ? {
              backgroundImage: `linear-gradient(
                    rgba(20, 27, 31, 0.7), 
                    rgba(20, 27, 31, 0.7)
                  ), url("${props.stream.coverURL}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { background: `rgba(20, 27, 31, 0.7)` }
      }
    >
      <div className={styles["player__title"]}>
        {"My very first stream number 1" /*props.stream.title*/}
      </div>

      <div className={styles["player__status"]}>
        {!props.stream.state.broadcast?.startAt && (
          <span className={styles["stream-bar__time"]}>
            +01:15:23{/*props.stream.timePassed*/}
          </span>
        )}

        <div />

        <div
          className={`${styles["player__counter"]} ${props.stream.state.isOnline ? "" : styles["stream-bar__counter_disabled"]} ${styles["stream-bar__counter1"]}`}
        >
          <ListenersIcon
            className={`${styles["player__icon"]} ${styles["player__icon_sm"]}`}
          />
          {props.wsClientCount.count}
        </div>

        <div
          className={`${styles["player__counter"]} ${props.stream.state.isOnline ? "" : styles["player__counter_disabled"]} ${styles["stream-bar__counter2"]}`}
        >
          <HeartIcon
            className={`${styles["player__icon"]} ${styles["player__icon_sm"]}`}
          />
          {props.stream.state.broadcast?.likeCount}
        </div>
      </div>

      <PlayToggleBtn
        className={styles["player__play-btn"]}
        isDisabled={true /*props.streamState.isOnline*/}
      />
    </section>
  );
}

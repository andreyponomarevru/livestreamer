import * as React from "react";

import DOMPurify from "dompurify";

import { type BroadcastState, type ClientCount } from "../../types";
import { MessageStrokeIcon, ShareStrokeIcon } from "../ui/icons";

import styles from "./player.module.css";
import { StateBadge } from "./state-badge";
import { MiniPlayer } from "./mini-player";

/* TODO : rename this component into "current-stream" */

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  stream: {
    timePassed: string;
    description: string;
    state: BroadcastState; // TODO: add the 'about' field
    coverURL: string;
  };
  wsClientCount: ClientCount;
  handleCloseChatClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Player(props: Props): React.ReactElement {
  console.log("component rerenders");

  return (
    <section className={`${styles["player"]} ${props.className || ""}`}>
      <div
        style={{
          backgroundImage: `url("${props.stream.coverURL}")`,
        }}
        className={styles["player__header"]}
      >
        <div className={styles["player__controls-1"]}>
          <StateBadge
            className={styles["player__status-badge"]}
            isStreamOnline={props.stream.state.isOnline}
          />

          <div></div>

          <div
            className={`${styles["player__btn"]} ${styles["player__btn_chat"]}`}
            onClick={() => props.handleCloseChatClick(true)}
          >
            <MessageStrokeIcon
              className={`${styles["player__btn_chat"]} ${styles["player__btn-icon"]}`}
            />
          </div>
          <div
            className={`${styles["player__btn"]} ${styles["player__btn_share"]}`}
          >
            <ShareStrokeIcon
              className={`${styles["player__btn_share"]} ${styles["player__btn-icon"]}`}
            />
          </div>
        </div>

        <MiniPlayer
          stream={props.stream}
          wsClientCount={props.wsClientCount}
          className={styles["player__controls-2"]}
        />
      </div>

      <div
        className={styles["player__about-stream"]}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(props.stream.description),
        }}
      ></div>
    </section>
  );
}

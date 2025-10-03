import * as React from "react";

import { StreamBarState } from "./stream-bar-status";
import { Counter } from "../../../ui/counter/counter-component";
import { PlayToggleBtn } from "../../../ui/play-toggle-btn/play-toggle-btn-component";
import { useStreamLikeWSEvent } from "../../../ws/hooks/use-stream-like-ws-event";
import { useClientCountWSEvent } from "../../../ws/hooks/use-client-count-ws--event";
import { type BroadcastState } from "../../../../types";
import { useStreamLikeCount } from "../hooks/use-stream-like-count";

import styles from "./stream-bar.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  streamState: BroadcastState;
}

export function StreamBar(props: Props): React.ReactElement {
  const { clientCount } = useClientCountWSEvent();

  const { likeCount, setLikeCount } = useStreamLikeCount();
  React.useEffect(() => {
    if (props.streamState?.broadcast?.likeCount) {
      setLikeCount(props.streamState?.broadcast?.likeCount);
    }
  }, [props.streamState?.broadcast?.likeCount]);

  //

  // NOTE: streamLike.likeCount - is the total number of likes of particular user,not the total number of the stream likes
  const streamLike = useStreamLikeWSEvent();
  React.useEffect(() => {
    if (streamLike) {
      setLikeCount((likeCount) => ++likeCount);
    }
  }, [streamLike]);

  return (
    <div className={`${styles["stream-bar"]} ${props.className || ""}`}>
      <PlayToggleBtn isStreamOnline={props.streamState.isOnline} />
      <StreamBarState
        className={styles["stream-bar__state"]}
        startAt={props.streamState.broadcast?.startAt}
      />
      <div className={styles["stream-bar__counters"]}>
        <Counter
          isVisible={props.streamState.isOnline}
          icon="heart"
          count={likeCount}
        />
        <Counter isVisible={true} icon="users" count={clientCount.count} />
      </div>
    </div>
  );
}

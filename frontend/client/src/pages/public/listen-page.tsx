import * as React from "react";

import { useStreamStateWSEvent } from "../../features/ws/hooks/use-stream-state-ws-event";
import {
  MiniPlayer,
  Player,
  useStreamLikeCount,
  useStreamTimer,
} from "../../features/player";
import { ChatBox } from "../../features/chat";
import { useClientCountWSEvent } from "../../features/ws/hooks/use-client-count-ws--event";
import { useStreamLikeWSEvent } from "../../features/ws/hooks/use-stream-like-ws-event";

import styles from "./listen-page.module.css";

export function ListenPage(): React.ReactElement {
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  // Stream

  const streamState = useStreamStateWSEvent(); // TODO: get from Redux
  const streamTitle = "My very first stream number 1";
  const timePassed = useStreamTimer(
    new Date().toISOString() /*props.streamState.broadcast?.startAt*/,
  );
  const streamCover =
    "https://www.wildlifeworldwide.com/images/discover/europe_norway_tromso_northern_lights_square.jpg";
  // NOTE: streamLike.likeCount - is the total number of likes of particular user,not the total number of the stream likes
  const streamLike = useStreamLikeWSEvent();
  React.useEffect(() => {
    if (streamLike) {
      setLikeCount((likeCount) => ++likeCount);
    }
  }, [streamLike]);
  const streamDescription = `
    <p>Here should be some short stream description some info or links or whaterver just leave it here Here should be some short stream description some info or links or whaterver just leave it here:</p>

    <p>
      <a href="http://andreyponomarev.ru" target="_blank">http://andreyponomarev.ru</a>
    </p>
    <p>
      <a href="http://vk.ru" target="_blank">http://vk.ru</a>
    </p>

    <p>Here should be some short stream description some info or links or
    whaterver just leave it here Here should be some short stream
    description some info or links or whaterver just leave it here
    Here should be some short stream description some info or links or
    whaterver just leave it here"</p>
  `;

  // Chat:

  const { clientCount } = useClientCountWSEvent();
  const { likeCount, setLikeCount } = useStreamLikeCount();
  React.useEffect(() => {
    if (streamState?.broadcast?.likeCount) {
      setLikeCount(streamState?.broadcast?.likeCount);
    }
  }, [streamState?.broadcast?.likeCount]);

  return (
    <>
      <div
        className={`${styles["listen-page"]} ${isChatOpen ? styles["listen-page_chat_open"] : ""}`}
      >
        <Player
          wsClientCount={clientCount}
          stream={{
            timePassed: timePassed,
            description: streamDescription,
            state: streamState,
            coverURL: streamCover,
          }}
          handleCloseChatClick={(isOpen) => setIsChatOpen(isOpen)}
          className={isChatOpen ? styles["listen-page__player"] : ""}
        />
      </div>

      {isChatOpen && (
        <div className={styles["listen-page__mini-player-and-chat-overlay"]}>
          <MiniPlayer
            wsClientCount={clientCount}
            stream={{
              timePassed: timePassed,
              state: streamState,
              coverURL: streamCover,
            }}
            isBackgroundImgShown={true}
            className={styles["listen-page__mini-player"]}
          />
          <ChatBox
            handleCloseChatClick={(isOpen) => setIsChatOpen(!isOpen)}
            className={styles["listen-page__chat-box"]}
          />
        </div>
      )}
    </>
  );
}

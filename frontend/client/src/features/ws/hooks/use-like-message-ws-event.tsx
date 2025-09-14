import * as React from "react";

import { useWebSocketEvents } from "./use-websocket-events";
import { type ChatMsgLike } from "../../../types";

function useLikeMessageWSEvent(
  messageId: number,
  setLikes: React.Dispatch<React.SetStateAction<Set<number>>>
) {
  const likeEvent = useWebSocketEvents<ChatMsgLike | null>(
    "chat:liked_message",
    null
  );
  React.useEffect(() => {
    if (likeEvent && messageId === likeEvent.messageId) {
      setLikes(new Set(likeEvent.likedByUserIds));
    }
  }, [likeEvent, messageId, setLikes]);
}

export { useLikeMessageWSEvent };

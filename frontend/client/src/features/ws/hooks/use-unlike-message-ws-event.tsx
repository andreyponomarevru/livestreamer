import * as React from "react";

import { useWebSocketEvents } from "./use-websocket-events";
import { type ChatMsgUnlike } from "../../../types";

export function useUnlikeMessageWSEvent(
  messageId: number,
  setLikes: React.Dispatch<React.SetStateAction<Set<number>>>,
) {
  const unlikeEvent = useWebSocketEvents<ChatMsgUnlike | null>(
    "chat:unliked_message",
    null,
  );
  React.useEffect(() => {
    if (unlikeEvent && unlikeEvent.messageId === messageId) {
      setLikes(new Set(unlikeEvent.likedByUserIds));
    }
  }, [unlikeEvent, messageId, setLikes]);

  return unlikeEvent;
}

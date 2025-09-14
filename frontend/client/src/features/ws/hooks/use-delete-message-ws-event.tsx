import * as React from "react";

import { useWebSocketEvents } from "./use-websocket-events";
import { type ChatMsgId } from "../../../types";

function useDeleteMessageWSEvent(
  deleteMessage: ({ messageId }: { messageId: number }) => void
) {
  const deleteMsgEvent = useWebSocketEvents<ChatMsgId | null>(
    "chat:deleted_message",
    null
  );
  React.useEffect(() => {
    if (deleteMsgEvent) deleteMessage({ messageId: deleteMsgEvent.id });
  }, [deleteMsgEvent, deleteMessage]);
}

export { useDeleteMessageWSEvent };

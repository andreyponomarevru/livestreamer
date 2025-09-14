import { useWebSocketEvents } from "./use-websocket-events";
import { type SavedBroadcastLike } from "../../../types";

function useStreamLikeWSEvent() {
  const streamLike = useWebSocketEvents<SavedBroadcastLike | null>(
    "stream:like",
    null
  );
  return streamLike;
}

export { useStreamLikeWSEvent };

import { useWebSocketEvents } from "./use-websocket-events";
import { type SavedBroadcastLike } from "../../../types";

export function useStreamLikeWSEvent() {
  const streamLike = useWebSocketEvents<SavedBroadcastLike | null>(
    "stream:like",
    null,
  );
  return streamLike;
}

import { useWebSocketEvents } from "./use-websocket-events";
import { type BroadcastState } from "../../../types";

export function useStreamStateWSEvent() {
  const streamState = useWebSocketEvents<BroadcastState>("stream:state", {
    isOnline: false,
  });

  return streamState;
}

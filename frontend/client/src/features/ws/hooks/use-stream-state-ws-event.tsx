import { useWebSocketEvents } from "./use-websocket-events";
import { type BroadcastState } from "../../../types";

function useStreamStateWSEvent() {
  const streamState = useWebSocketEvents<BroadcastState>("stream:state", {
    isOnline: false,
  });

  return streamState;
}

export { useStreamStateWSEvent };

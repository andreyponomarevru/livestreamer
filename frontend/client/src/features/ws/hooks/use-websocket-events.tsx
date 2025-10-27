import * as React from "react";

import { WebSocketContext } from "../context";
import { type WSMsgEvent } from "../../../types";

export function useWebSocketEvents<State>(
  event: WSMsgEvent,
  initialState: State,
): State {
  const ws = React.useContext(WebSocketContext);
  const [state, setState] = React.useState<State>(initialState);

  React.useEffect(() => {
    // console.log("[useWS] [useEffect]");
    if (ws) {
      ws.bindToServerEvents(event, setState);
      // console.log(`[useWS] [useEffect] Bound to ${event}`);
    }

    return () => {
      if (ws) {
        ws.unbindFromServerEvents(event, setState);
      }
    };
  }, [ws, state]);

  return state;
}

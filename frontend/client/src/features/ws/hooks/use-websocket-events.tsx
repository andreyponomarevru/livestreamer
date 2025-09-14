import * as React from "react";

import { WebSocketContext } from "../context";
import { type WSMsgEvent } from "../../../types";
import { useIsMounted } from "./../../../hooks/use-is-mounted";

function useWebSocketEvents<State>(
  event: WSMsgEvent,
  initialState: State
): State {
  const isMounted = useIsMounted();
  const ws = React.useContext(WebSocketContext);
  const [state, setState] = React.useState<State>(initialState);

  React.useEffect(() => {
    // console.log("[useWS] [useEffect]");
    if (isMounted && ws) {
      ws.bindToServerEvents(event, setState);
      // console.log(`[useWS] [useEffect] Bound to ${event}`);
    }

    return () => {
      if (ws && isMounted) {
        ws.unbindFromServerEvents(event, setState);
      }
    };
  }, [ws, state, isMounted]);

  return state;
}

export { useWebSocketEvents };

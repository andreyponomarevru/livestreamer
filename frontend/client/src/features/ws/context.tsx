import React, { createContext, type JSX } from "react";

import { WebSocketClient } from "./ws-client";
import { WS_SERVER_URL } from "../../config/env";

function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  let wsClient: WebSocketClient | undefined;

  if (!wsClient) {
    console.debug("[ws] Create a new WebSocket client");
    wsClient = new WebSocketClient(WS_SERVER_URL);
  }

  return (
    <WebSocketContext.Provider value={wsClient}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Use Context to make WebSocket object available from any component
const WebSocketContext = createContext<WebSocketClient | null>(null);

export { WebSocketProvider, WebSocketContext };

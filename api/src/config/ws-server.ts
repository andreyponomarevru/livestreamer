import { type ServerOptions } from "ws";

import { WS_SERVER_URL } from "./env";

export const serverOptions: ServerOptions = {
  noServer: true, // Run WebSocket Server completely independent of HTTP Server
  path: new URL(WS_SERVER_URL).pathname,
  clientTracking: false,
};

export const STATS_MSG_TIME_INTERVAL = 30000;

import http from "http";

import { expressApp } from "./express-app";
import {
  onServerListening,
  onServerError,
  onServerUpgrade,
} from "./http-server-event-handlers";

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);

export { httpServer };

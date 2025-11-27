import { NODE_HTTP_PORT } from "./config/env";

import { httpServer } from "./http-server";
import {
  onUncaughtException,
  onUnhandledRejection,
  onWarning,
} from "./node-process-event-handlers";

process.once("uncaughtException", onUncaughtException);
process.on("unhandledRejection", onUnhandledRejection);
process.on("warning", onWarning);
process.on("exit", onWarning);

httpServer.listen(NODE_HTTP_PORT);

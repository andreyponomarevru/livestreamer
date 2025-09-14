import path from "path";
import express from "express";
import cors from "cors";
import morganLogger from "morgan";
import session from "express-session";
import { HTTP_PORT } from "./config/env";
import { morganSettings, logger } from "./config/logger";
import { handleErrors } from "./middlewares/handle-errors";
import { handle404Error } from "./middlewares/handle-404-error";
import { SHOULD_EXPRESS_TRUST_FIRST_PROXY } from "./config/env";
import { sessionConfig } from "./config/redis";
import { apiRouter } from "./controllers/router";

const expressApp = express();
expressApp.set("port", HTTP_PORT);
if (SHOULD_EXPRESS_TRUST_FIRST_PROXY) expressApp.set("trust proxy", 1);
// Save in var in order to reuse it for WebSocket Upgrade request
// authentication:
const sessionParser = session(sessionConfig);

expressApp.use(cors({ credentials: true, origin: true }));

expressApp.use(sessionParser);
expressApp.use((req, res, next) => {
  logger.debug(req.headers);
  next();
});
expressApp.use(morganLogger("combined", morganSettings));
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.static(path.join(__dirname, "public")));
expressApp.use("/api/v1", apiRouter);
// If request doesn't match the routes above, it is past to 404 error handler
expressApp.use(handle404Error);
expressApp.use(handleErrors);

export { expressApp, sessionParser };

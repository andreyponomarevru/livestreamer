import express from "express";

import { broadcastsRouter } from "./broadcasts/router";
import { adminRouter } from "./admin/router";
import { sessionRouter } from "./sessions/router";
import { verificationRouter } from "./verification/router";
import { usersRouter } from "./users/router";

export const apiRouter = express
  .Router()
  .use("/broadcasts", broadcastsRouter)
  .use("/users", usersRouter)
  .use("/sessions", sessionRouter)
  .use("/verification", verificationRouter)
  .use("/admin", adminRouter)
  .use("/health", (req, res) => res.status(200).send("OK"));

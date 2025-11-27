import express from "express";
import { broadcastsRouter } from "./broadcasts/router";
import { adminRouter } from "./admin/router";
import { sessionRouter } from "./sessions/router";
import { verificationRouter } from "./verification/router";
import { usersRouter } from "./users/router";

// Problems to fix:
//
// - Maintain separate server stream for each streamer

export const apiRouter = express
  .Router()
  .use("/broadcasts", broadcastsRouter)
  .use("/users", usersRouter)
  .use("/sessions", sessionRouter)
  .use("/verification", verificationRouter)
  .use("/admin", adminRouter);

import { type Socket } from "net";
import util from "util";
import { randomUUID } from "crypto";

import { type Request, type Response } from "express";

import { wsServer } from "./ws-server";
import { WSChatClient } from "./services/ws";
import { NODE_HTTP_PORT } from "./config/env";
import { logger } from "./config/logger";
import { sessionParser } from "./express-app";

export async function onServerListening(): Promise<void> {
  logger.debug(
    `${__filename}: API HTTP Server is listening on port ${NODE_HTTP_PORT}`,
  );
}

export function onServerError(err: NodeJS.ErrnoException): void | never {
  if (err.syscall !== "listen") throw err;

  const bind =
    typeof NODE_HTTP_PORT === "string"
      ? `Pipe ${NODE_HTTP_PORT}`
      : `Port ${NODE_HTTP_PORT}`;

  switch (err.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}

export function handleNewWSConnection(
  req: Request,
  socket: Socket,
  head: Buffer,
) {
  logger.debug(
    `${__filename} onServerUpgrade > sessionParser: session ID is ${req.sessionID}`,
  );
  logger.debug(
    `${__filename} onServerUpgrade > sessionParser: ${util.inspect(
      req.session,
    )}`,
  );

  if (req.session && req.session.authenticatedUser) {
    logger.info(`${__filename} [upgrade] User successfully authenticated`);

    const username = req.session.authenticatedUser.username;
    const userId = req.session.authenticatedUser.userId;
    const uuid = req.session.authenticatedUser!.uuid!;

    wsServer.handleUpgrade(req, socket, head, (newSocket) => {
      wsServer.emit(
        "connection",
        new WSChatClient({ uuid, userId, username, socket: newSocket }),
      );
    });
  } else {
    logger.info(`${__filename}: [upgrade] User is not authenticated.`);
    // Add unauthenticated users to the store too, to be able to track the total number of opened connections
    wsServer.handleUpgrade(req, socket, head, (newSocket) => {
      const uuid = randomUUID();

      wsServer.emit(
        "connection",
        new WSChatClient({
          uuid,
          username: uuid,
          socket: newSocket,
        }),
      );
    });

    // Alternatively we can completely deny the access for unauthenticated users
    // socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    // socket.destroy();
    // return;
  }
}

// For an example of WebSocket authentication using express-session, refer to
// https://github.com/websockets/ws#client-authentication (just a basic idea)
// https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js — this is what i've based my code on
export async function onServerUpgrade(
  req: Request,
  socket: Socket,
  head: Buffer,
): Promise<void> {
  logger.debug("Parse session from request");

  sessionParser(req, {} as Response, () => {
    handleNewWSConnection(req, socket, head);
  });
}

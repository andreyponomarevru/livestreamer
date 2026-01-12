import { type Socket } from "net";
import { randomUUID } from "crypto";
import util from "util";

import { type Request, type Response } from "express";

import { wsServer } from "./ws-server";
import { NODE_HTTP_PORT } from "./config/env";
import { logger } from "./config/logger";
import { sessionParser } from "./express-app";
import { rabbitMQConsumer } from "./config/rabbitmq/consumer";
import { AMQP_SERVER_CONFIG, QUEUES } from "./config/rabbitmq/config";
import { WSChatClient } from "./services/ws";

export async function onServerListening(): Promise<void> {
  await rabbitMQConsumer.connection.open(AMQP_SERVER_CONFIG, [
    QUEUES.confirmSignUpEmail.queue,
    QUEUES.welcomeEmail.queue,
    QUEUES.resetPasswordEmail.queue,
  ]);
  logger.debug(`${__filename}: RabbitMQ Consumer connection is opened`);

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

// For an example of WebSocket authentication using express-session, refer to
// https://github.com/websockets/ws#client-authentication (just a basic idea)
// https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js — this is what i've based my code on
export async function onServerUpgrade(
  req: Request,
  socket: Socket,
  head: Buffer,
): Promise<void> {
  socket.on("error", onSocketError);

  sessionParser(req, {} as Response, () => {
    logger.debug("Parse session from request...");
    logger.debug(`${__filename} session ID is ${req.sessionID}`);
    logger.debug(`${__filename} ${util.inspect(req.session)}`);

    socket.removeListener("error", onSocketError);

    const broadcastId = Number(req.url.slice(1));
    const validPathRegexp = /^[1-9]\d*$/;
    if (!validPathRegexp.test(String(broadcastId))) {
      logger.error(`${req.url} does not match the regex`);

      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
      return;
    }

    // We need the req.url to strictly match the ws server url provided in its config (which is ws://website.ru i.e. not containing any params). If we leave the url as is - with the client-provided parameters e.g. "ws://website.ru/25" - the callback of handleUpgrade will never be triggered and ws will silently reject the upgrade.
    req.url = "/";

    wsServer.handleUpgrade(req, socket, head, function (newSocket) {
      let wsClient: WSChatClient;

      if (req.session && req.session.authenticatedUser) {
        logger.debug(`${__filename} [upgrade] User successfully authenticated`);

        const username = req.session.authenticatedUser.username;
        const userId = req.session.authenticatedUser.userId;
        const uuid = req.session.authenticatedUser.uuid!;
        const profilePictureUrl =
          req.session.authenticatedUser.profilePictureUrl;

        wsClient = new WSChatClient({
          uuid,
          userId,
          username,
          broadcastId,
          profilePictureUrl,
          socket: newSocket,
        });
      } else {
        // Add unauthenticated users to the store too, to be able to track the total number of chat clients

        logger.debug(`${__filename}: [upgrade] User is not authenticated.`);

        const uuid = randomUUID();

        wsClient = new WSChatClient({
          uuid,
          username: uuid,
          broadcastId,
          socket: newSocket,
          profilePictureUrl: "",
        });
      }

      wsServer.emit("connection", new WSChatClient(wsClient));
    });
  });
}

function onSocketError(err: Error) {
  console.error(err);
}

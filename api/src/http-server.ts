import http from "http";

import { expressApp } from "./express-app";
import {
  onServerListening,
  onServerError,
  onServerUpgrade,
} from "./http-server-event-handlers";
import { rabbitMQConsumer } from "./config/rabbitmq/consumer";
import { AMQP_SERVER_CONFIG, QUEUES } from "./config/rabbitmq/config";

const httpServer = http.createServer(expressApp);
httpServer.on("error", onServerError);
httpServer.on("listening", onServerListening);
httpServer.on("upgrade", onServerUpgrade);

rabbitMQConsumer.connection
  .open(AMQP_SERVER_CONFIG, [
    QUEUES.confirmSignUpEmail.queue,
    QUEUES.welcomeEmail.queue,
    QUEUES.resetPasswordEmail.queue,
  ])
  .catch(console.error);

export { httpServer };

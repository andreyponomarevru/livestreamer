import amqpClient from "amqplib";
import { beforeEach } from "@jest/globals";

import { dbConnection } from "../../src/config/postgres";
import { redisConnection } from "../../src/config/redis";
import { logger } from "../../src/config/logger";
import { AMQP_SERVER_CONFIG, QUEUES } from "../../src/config/rabbitmq/config";

const tablesToTruncate = [
  "broadcast_like",
  "chat_message_like",
  "chat_message",
  "broadcast",
  "appuser",
];

async function truncateNonEssentialDBTables(tableNames: string[]) {
  const pool = await dbConnection.open();
  await pool.query(
    `TRUNCATE ${tableNames.join(", ")} RESTART IDENTITY CASCADE`,
  );
}

async function emptyRedis() {
  const client = await redisConnection.open();
  await client.flushAll();
}

async function purgeRabbitMQQueues(queues: string[]) {
  const connection = await amqpClient.connect(AMQP_SERVER_CONFIG);
  connection.on("error", (err) => {
    if (err.message !== "Connection closing") {
      console.error(
        `[ Jest truncate-tables Hook ] Consumer Connection error ` +
          err.message,
      );
    }
  });

  const channel = await connection.createChannel();

  for (const queue of queues) {
    if (await channel.assertQueue(queue)) await channel.purgeQueue(queue);
  }

  await connection.close();
}

// Execute before each test
beforeEach(async () => {
  await truncateNonEssentialDBTables(tablesToTruncate);
  await emptyRedis();
  await purgeRabbitMQQueues([
    QUEUES.confirmSignUpEmail.queue,
    QUEUES.welcomeEmail.queue,
    QUEUES.resetPasswordEmail.queue,
  ]);

  logger.silent = true;
});

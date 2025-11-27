import { afterAll } from "@jest/globals";
import { dbConnection } from "../../src/config/postgres";
import { redisConnection } from "../../src/config/redis";
import { rabbitMQPublisher } from "../../src/config/rabbitmq/publisher";
import { rabbitMQConsumer } from "../../src/config/rabbitmq/consumer";
import { QUEUES } from "../../src/config/rabbitmq/config";

afterAll(async () => {
  console.log("[ Jest - afterAll Hook ]");

  await dbConnection.close();

  redisConnection.quit();

  await rabbitMQPublisher.connection.close();
  await rabbitMQConsumer.deleteQueues(
    Object.values(QUEUES).map((i) => i.queue),
  );
  await rabbitMQConsumer.connection.close();
});

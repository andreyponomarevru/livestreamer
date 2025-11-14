import amqpClient, {
  type Channel,
  type ChannelModel,
  type ConsumeMessage,
} from "amqplib";
import EventEmitter from "events";
import { logger } from "../logger";
import { AMQP_SERVER_CONFIG, QUEUES } from "./config";

class MessageQueueEmitter extends EventEmitter {}
export const messageQueueEmitter = new MessageQueueEmitter();

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

export const rabbitMQConsumer = {
  connection: {
    open: async function () {
      if (!connection) {
        connection = await amqpClient.connect(AMQP_SERVER_CONFIG);

        connection.on("error", (err) => {
          if (err.message !== "Connection closing") {
            logger.error("[Consumer] Connection error " + err.message);
            connection = null;
          }
        });

        logger.debug("[Consumer] Opened a new connection to RabbitMQ");
      }

      if (!channel) channel = await connection.createChannel();
      channel.on("error", (err) => {
        console.error("[Consumer] Channel error" + err.message);
      });
      channel.on("close", () => console.log("[Consumer] Channel closed"));
      await channel.prefetch(10);

      await rabbitMQConsumer.consumeQueue(
        channel,
        QUEUES.confirmSignUpEmail.queue,
      );
      await rabbitMQConsumer.consumeQueue(channel, QUEUES.welcomeEmail.queue);
      await rabbitMQConsumer.consumeQueue(
        channel,
        QUEUES.resetPasswordEmail.queue,
      );
    },

    close: async function (msg = "[Consumer] Connection closed") {
      if (channel) {
        await channel.close();
      }

      if (connection) {
        await connection.close();
        connection = null;
        logger.error(msg);
      }
    },
  },

  consumeQueue: async function (channel: Channel, queueName: string) {
    if (!connection) {
      throw new Error("Connection or channel doesn't exist");
    }

    async function handleMessage(msg: ConsumeMessage | null) {
      console.dir(msg);
      console.log("Event name" + queueName);
      if (msg !== null) {
        messageQueueEmitter.emit(queueName, String(msg.content));
        channel.ack(msg);
      }
    }

    await channel.assertQueue(queueName, { durable: true });
    await channel.consume(queueName, handleMessage, { noAck: false });

    logger.debug("[Consumer] Waiting for messages ...");
  },
};

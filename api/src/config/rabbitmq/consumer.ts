import amqpClient, {
  type Channel,
  type ChannelModel,
  type ConsumeMessage,
} from "amqplib";
import EventEmitter from "events";
import { logger } from "../logger";

class MessageQueueEmitter extends EventEmitter {}
export const messageQueueEmitter = new MessageQueueEmitter();

let connection: ChannelModel | null = null;
let channel: Channel | null = null;
const consumerTags = new Map<string, string>();

export const rabbitMQConsumer = {
  connection: {
    open: async function (
      config: amqpClient.Options.Connect,
      queuesNames: string[],
    ) {
      if (!connection) {
        connection = await amqpClient.connect(config);

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
      channel.on("close", () => logger.debug("[Consumer] Channel closed"));

      await channel.prefetch(10);

      for (const queueName of queuesNames) {
        await rabbitMQConsumer.consumeQueue(channel, queueName);
      }
    },

    close: async function (msg = "[Consumer] Connection closed") {
      if (channel) {
        for (const tag of consumerTags.values()) {
          await channel.cancel(tag);
        }
        consumerTags.clear();
        await channel.close();

        logger.debug("[Consumer] Channel closed");
      }

      if (connection) {
        await connection.close();
        connection = null;
        logger.debug(msg);
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
    const consumeResult = await channel.consume(queueName, handleMessage, {
      noAck: false,
    });
    consumerTags.set(queueName, consumeResult.consumerTag);

    logger.debug("[Consumer] Waiting for messages ...");
  },

  deleteQueues: async function (queuesNames: string[]) {
    if (!channel) return;

    for (const name of queuesNames) {
      await channel.deleteQueue(name);
    }
  },
};

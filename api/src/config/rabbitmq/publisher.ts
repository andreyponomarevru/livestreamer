import amqpClient, { type ChannelModel, type Channel } from "amqplib";
import { logger } from "../logger";
import { AMQP_SERVER_CONFIG } from "./config";

type RabbitMQMessage = {
  queue: string;
  exchange: string;
  routingKey: string;
  content: Buffer;
};

let connection: ChannelModel | null = null;
let pubChannel: Channel | null = null;

export const rabbitMQPublisher = {
  connection: {
    connect: async function () {
      function handleError(err: Error) {
        if (err.message !== "Connection closing") {
          logger.error("[Publisher] AMQP connection error " + err.message);
          connection = null;
        }
      }

      function handleCloseConnection() {
        logger.debug("[Publisher] AMQP connection closed");
        connection = null;
      }

      if (connection) {
        logger.debug(
          "Publisher is reusing the existing connection to RabbitMQ",
        );
      } else {
        connection = await amqpClient.connect(AMQP_SERVER_CONFIG);
        connection.on("error", handleError);
        connection.on("close", handleCloseConnection);

        logger.debug("Publisher opened a new connection to RabbitMQ");
      }

      return connection;
    },

    close: async function () {
      if (connection) {
        await connection.close();
        connection = null;
      }
    },
  },

  sendMsgToQueue: async function (msg: RabbitMQMessage) {
    try {
      const connection = await this.connection.connect();
      pubChannel = await connection.createChannel();
      await pubChannel.assertExchange(msg.exchange, "direct", {
        durable: true,
      });
      await pubChannel.assertQueue(msg.queue, { durable: true });
      await pubChannel.bindQueue(msg.queue, msg.exchange, msg.routingKey);
      pubChannel.publish(msg.exchange, msg.routingKey, msg.content, {
        persistent: true,
      });

      await pubChannel.close();

      logger.info("[Publisher] Message sent");
    } catch (err) {
      logger.error("[Publisher] Error during message publishing" + err);
    }
  },
};

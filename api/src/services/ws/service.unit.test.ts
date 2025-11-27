import { jest, describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import WebSocket from "ws";

import { wsService } from "./service";
import { logger } from "../../config/logger";
import type { WSMsg, WSClient } from "../../types";

jest.mock("../../../src/config/logger");

const wsMessage: WSMsg = {
  event: "chat:new_client",
  data: { uuid: randomUUID(), username: faker.internet.username() },
};

function createWSClient(): WSClient {
  return {
    uuid: randomUUID(),
    username: faker.internet.username(),
    socket: { send: jest.fn() } as unknown as WebSocket,
  };
}

describe("send", () => {
  it("logs a message if the reciever exists", () => {
    wsService.send(wsMessage, createWSClient());

    expect(jest.mocked(logger.info)).toHaveBeenCalledTimes(1);
    const calledWithArg = jest.mocked(logger.info).mock.calls[0][0];
    expect(typeof calledWithArg).toBe("string");
  });

  it("sends a message if the reciever exists", () => {
    const wsClient = createWSClient();

    wsService.send(wsMessage, wsClient);

    expect(wsClient.socket.send).toHaveBeenCalledTimes(1);
    expect(wsClient.socket.send).toHaveBeenLastCalledWith(
      JSON.stringify(wsMessage),
    );
  });
});

describe("sendToAll", () => {
  it("sends a message to all clients", () => {
    const message = JSON.stringify(wsMessage);
    const clients = Array.from(Array(10).keys()).map(createWSClient);

    wsService.sendToAll(wsMessage, clients);

    clients.forEach((client) => {
      expect(client.socket.send).toHaveBeenCalledTimes(1);
      expect(client.socket.send).toHaveBeenCalledWith(message);
    });
  });
});

describe("sendToAllExceptSender", () => {
  it("sends a message to all clients except the sender", () => {
    const message = JSON.stringify(wsMessage);
    const clients = Array.from(Array(10).keys()).map(createWSClient);

    wsService.sendToAllExceptSender(
      wsMessage,
      { senderUUID: clients[3].uuid },
      clients,
    );

    clients.forEach((client, index) => {
      if (index === 3) {
        expect(clients[3].socket.send).not.toBeCalled();
        return;
      }

      expect(client.socket.send).toBeCalledTimes(1);
      expect(client.socket.send).toBeCalledWith(message);
    });
  });
});

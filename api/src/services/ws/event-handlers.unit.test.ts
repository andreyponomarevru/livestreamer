import EventEmitter from "events";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import WebSocket from "ws";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { onConnection } from "./event-handlers";
import { sendBroadcastState, streamService } from "../stream";
import { WSClient } from "../../types";
import { wsService } from ".";

jest.mock("../stream");

describe("onConnection", () => {
  class WebSocketEmitter extends EventEmitter {
    public send: () => void;

    constructor() {
      super();
      this.send = jest.fn();
    }

    close() {
      this.emit("close");
    }
  }

  const client: WSClient = {
    uuid: randomUUID(),
    username: faker.internet.username(),
    socket: new WebSocketEmitter() as unknown as WebSocket,
  };

  let addClientSpy: jest.SpiedFunction<typeof wsService.clientStore.addClient>;

  beforeEach(() => {
    addClientSpy = jest
      .spyOn(wsService.clientStore, "addClient")
      .mockImplementation(jest.fn());
  });

  it("sets the 'close' event handler on the client's socket", async () => {
    await onConnection(client);

    expect(client.socket.listeners("close").length).toBe(1);
  });

  it("sends the broadcast state to the client", async () => {
    const broadcastState = { isOnline: false };
    jest
      .spyOn(streamService, "readBroadcastState")
      .mockResolvedValue(broadcastState);

    await onConnection(client);

    expect(jest.mocked(sendBroadcastState)).toHaveBeenCalledTimes(1);
    const calledWithArg1 = jest.mocked(sendBroadcastState).mock.calls[0][0];
    const calledWithArg2 = jest.mocked(sendBroadcastState).mock.calls[0][1];
    expect(calledWithArg1).toStrictEqual(client);
    expect(calledWithArg2).toStrictEqual(broadcastState);
  });

  it("adds the client to the store", async () => {
    await onConnection(client);

    expect(addClientSpy).toHaveBeenCalledTimes(1);
    expect(addClientSpy).toHaveBeenCalledWith(client);
  });
});

import { jest, describe, it, expect } from "@jest/globals";
import WebSocket from "ws";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import {
  sendBroadcastState,
  onStreamEnd,
  onStreamLike,
  onStreamStart,
} from ".";
import { wsService } from "../ws";
import { BroadcastDraft, BroadcastState, WSClient } from "../../types";

describe("onStreamLike", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      broadcastId: faker.number.int(),
      likedByUserUUID: randomUUID(),
      likedByUserId: faker.number.int(),
      likedByUsername: faker.internet.username(),
      likeCount: faker.number.int(),
    };
    const sendSpy = jest.spyOn(wsService, "sendToAllExceptSender");

    onStreamLike(eventData);

    expect(sendSpy).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    const thirdArg = sendSpy.mock.calls[0][2];
    expect(firstArg).toStrictEqual({ event: "stream:like", data: eventData });
    expect(secondArg).toStrictEqual({
      senderUUID: eventData.likedByUserUUID,
    });
    expect(thirdArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onStreamStart", () => {
  it("sends the message to all clients", () => {
    const eventData: BroadcastDraft = {
      id: faker.number.int(),
      title: faker.lorem.sentence(),
      startAt: faker.date.past().toISOString(),
      listenerPeakCount: faker.number.int(),
      likeCount: faker.number.int(),
    };
    const sendSpy = jest.spyOn(wsService, "sendToAll");

    onStreamStart(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    expect(firstArg).toStrictEqual({
      event: "stream:state",
      data: { isOnline: true, broadcast: eventData },
    });
    expect(secondArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onStreamEnd", () => {
  it("sends the message to all clients", () => {
    const sendSpy = jest.spyOn(wsService, "sendToAll");

    onStreamEnd();

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    expect(firstArg).toStrictEqual({
      event: "stream:state",
      data: { isOnline: false },
    });
    expect(secondArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("sendBroadcastState", () => {
  it("sends the message to the client", () => {
    const wsClient: WSClient = {
      uuid: randomUUID(),
      id: faker.number.int(),
      username: faker.internet.username(),
      socket: { send: () => {} } as unknown as WebSocket,
    };
    const broadcastState: BroadcastState = {
      isOnline: faker.datatype.boolean(),
      broadcast: {
        likeCount: faker.number.int(),
        id: faker.number.int(),
        title: faker.lorem.sentence(),
        startAt: faker.date.past().toISOString(),
        listenerPeakCount: faker.number.int(),
      },
    };
    const sendSpy = jest.spyOn(wsService, "send");

    sendBroadcastState(wsClient, broadcastState);

    expect(wsService.send).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    expect(firstArg).toStrictEqual({
      event: "stream:state",
      data: broadcastState,
    });
    expect(secondArg).toStrictEqual(wsClient);
  });
});

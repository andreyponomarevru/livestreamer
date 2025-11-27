import { jest, describe, it, expect } from "@jest/globals";
import WebSocket from "ws";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import {
  onUnlikeChatMsg,
  onLikeChatMsg,
  onDestroyChatMsg,
  onCreateChatMsg,
  onUpdateClientCount,
  onDeleteClient,
  onAddClient,
  onChatStart,
} from ".";
import { wsService } from "../ws";
import { SanitizedWSChatClient, DeletedWSClient, WSClient } from "../../types";

describe("onChatStart", () => {
  const wsClient: WSClient = {
    uuid: randomUUID(),
    id: faker.number.int(),
    username: faker.internet.username(),
    socket: { send: () => {} } as unknown as WebSocket,
  };

  it("sends the message to the client", () => {
    const sendSpy = jest.spyOn(wsService, "send");

    onChatStart(wsClient);

    expect(sendSpy).toHaveBeenCalledTimes(2);

    const firstCallArg1 = sendSpy.mock.calls[0][0];
    const firstcallArg2 = sendSpy.mock.calls[0][1];
    expect(firstCallArg1).toStrictEqual({
      event: "chat:client_list",
      data: [],
    });
    expect(firstcallArg2).toStrictEqual(wsClient);

    const secondCallArg1 = sendSpy.mock.calls[1][0];
    const secondCallArg2 = sendSpy.mock.calls[1][1];
    expect(secondCallArg1).toStrictEqual({
      event: "chat:client_count",
      data: { count: 0 },
    });
    expect(secondCallArg2).toStrictEqual(wsClient);
  });
});

describe("onUnlikeChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      messageId: faker.number.int(),
      unlikedByUserUUID: randomUUID(),
      unlikedByUserId: faker.number.int(),
      likedByUserIds: [45, 15, 1, 57],
    };
    const sendSpy = jest.spyOn(wsService, "sendToAllExceptSender");

    onUnlikeChatMsg(eventData);

    expect(sendSpy).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    const thirdArg = sendSpy.mock.calls[0][2];
    expect(firstArg).toStrictEqual({
      event: "chat:unliked_message",
      data: eventData,
    });
    expect(secondArg).toStrictEqual({
      senderUUID: eventData.unlikedByUserUUID,
    });
    expect(thirdArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onLikeChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      messageId: faker.number.int(),
      likedByUserId: faker.number.int(),
      likedByUserIds: [8, 58, 78, 9],
      likedByUserUUID: randomUUID(),
    };
    const sendSpy = jest.spyOn(wsService, "sendToAllExceptSender");

    onLikeChatMsg(eventData);

    expect(sendSpy).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    const thirdArg = sendSpy.mock.calls[0][2];
    expect(firstArg).toStrictEqual({
      event: "chat:liked_message",
      data: eventData,
    });
    expect(secondArg).toStrictEqual({ senderUUID: eventData.likedByUserUUID });
    expect(thirdArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onDestroyChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      id: faker.number.int(),
      userUUID: randomUUID(),
      userId: faker.number.int(),
    };
    const sendSpy = jest.spyOn(wsService, "sendToAllExceptSender");

    onDestroyChatMsg(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    const thirdArg = sendSpy.mock.calls[0][2];
    expect(firstArg).toStrictEqual({
      event: "chat:deleted_message",
      data: eventData,
    });
    expect(secondArg).toStrictEqual({ senderUUID: eventData.userUUID });
    expect(thirdArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onCreateChatMsg", () => {
  it("sends the message to all except sender", () => {
    const eventData = {
      id: faker.number.int(),
      userUUID: randomUUID(),
      userId: faker.number.int(),
      username: faker.internet.username(),
      createdAt: faker.date.past().toISOString(),
      message: faker.lorem.paragraph(),
      likedByUserId: [2, 8, 25, 48],
    };
    const sendSpy = jest.spyOn(wsService, "sendToAllExceptSender");

    onCreateChatMsg(eventData);

    expect(wsService.sendToAllExceptSender).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    const thirdArg = sendSpy.mock.calls[0][2];
    expect(firstArg).toStrictEqual({
      event: "chat:created_message",
      data: eventData,
    });
    expect(secondArg).toStrictEqual({ senderUUID: eventData.userUUID });
    expect(thirdArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onUpdateClientCount", () => {
  it("sends the message to all clients", () => {
    const eventData = faker.number.int();
    const sendSpy = jest.spyOn(wsService, "sendToAll");

    onUpdateClientCount(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    expect(firstArg).toStrictEqual({
      event: "chat:client_count",
      data: { count: eventData },
    });
    expect(secondArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onDeleteClient", () => {
  it("sends the message to all clients", () => {
    const eventData: DeletedWSClient = {
      uuid: randomUUID(),
      username: faker.internet.username(),
      id: faker.number.int(),
    };
    const sendSpy = jest.spyOn(wsService, "sendToAll");

    onDeleteClient(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    expect(firstArg).toStrictEqual({
      event: "chat:deleted_client",
      data: eventData,
    });
    expect(secondArg).toStrictEqual(wsService.clientStore.clients);
  });
});

describe("onAddClient", () => {
  it("sands the message to all clients", () => {
    const eventData: SanitizedWSChatClient = {
      uuid: randomUUID(),
      username: faker.internet.username(),
    };
    const sendSpy = jest.spyOn(wsService, "sendToAll");

    onAddClient(eventData);

    expect(wsService.sendToAll).toHaveBeenCalledTimes(1);

    const firstArg = sendSpy.mock.calls[0][0];
    const secondArg = sendSpy.mock.calls[0][1];
    expect(firstArg).toStrictEqual({
      event: "chat:new_client",
      data: eventData,
    });
    expect(secondArg).toStrictEqual(wsService.clientStore.clients);
  });
});

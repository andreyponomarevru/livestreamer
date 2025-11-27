import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { ChatEmitter } from ".";

describe("StreamEmitter", () => {
  const chatEmitter = new ChatEmitter();

  beforeEach(() => {
    jest.spyOn(chatEmitter, "emit");
  });

  describe("createChatMsg", () => {
    it("emits the 'create_message' event, providing the message object", () => {
      const msg = {
        userUUID: randomUUID(),
        id: faker.number.int(),
        userId: faker.number.int(),
        username: faker.internet.username(),
        createdAt: String(faker.date.future()),
        message: faker.lorem.paragraphs(),
        likedByUserId: [faker.number.int(), faker.number.int()],
      };
      const eventName = "create_message";

      chatEmitter.createChatMsg(msg);

      expect(chatEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(chatEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(chatEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toStrictEqual(msg);
    });
  });

  describe("destroyChatMsg", () => {
    it("emits the 'delete_message' event, providing the message object", () => {
      const msg = {
        id: faker.number.int(),
        userId: faker.number.int(),
        userUUID: randomUUID(),
      };
      const eventName = "delete_message";

      chatEmitter.destroyChatMsg(msg);

      expect(chatEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(chatEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(chatEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toStrictEqual(msg);
    });
  });

  describe("likeChatMsg", () => {
    it("emits the 'like_message' event, providing the message object", () => {
      const like = {
        likedByUserUUID: randomUUID(),
        messageId: faker.number.int(),
        likedByUserId: faker.number.int(),
        likedByUserIds: [faker.number.int(), faker.number.int()],
      };
      const eventName = "like_message";

      chatEmitter.likeChatMsg(like);

      expect(chatEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(chatEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(chatEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toStrictEqual(like);
    });
  });

  describe("unlikeChatMsg", () => {
    it("emits the 'unlike_message' event, providing the unlike object", () => {
      const unlike = {
        unlikedByUserUUID: randomUUID(),
        messageId: faker.number.int(),
        unlikedByUserId: faker.number.int(),
        likedByUserIds: [faker.number.int(), faker.number.int()],
      };
      const eventName = "unlike_message";

      chatEmitter.unlikeChatMsg(unlike);

      expect(chatEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(chatEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(chatEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toStrictEqual(unlike);
    });
  });
});

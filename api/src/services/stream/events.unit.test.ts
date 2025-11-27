import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { StreamEmitter } from ".";

describe("StreamEmitter", () => {
  const streamEmitter = new StreamEmitter();

  beforeEach(() => {
    jest.spyOn(streamEmitter, "emit");
  });

  describe("start", () => {
    it("emits the 'start' event, providing the broadcast object", () => {
      const broadcast = {
        id: faker.number.int(),
        title: faker.lorem.sentence(),
        startAt: faker.date.future().toISOString(),
        listenerPeakCount: faker.number.int(),
        likeCount: faker.number.int(),
      };
      const eventName = "start";

      streamEmitter.start(broadcast);

      expect(streamEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(streamEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(streamEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toStrictEqual(broadcast);
    });
  });

  describe("end", () => {
    it("emits the 'end' event", () => {
      const eventName = "end";
      jest.spyOn(streamEmitter, "emit");

      streamEmitter.end();

      expect(streamEmitter.emit).toHaveBeenCalledTimes(1);
      expect(streamEmitter.emit).toHaveBeenCalledWith(eventName);
    });
  });

  describe("like", () => {
    it("emits the 'like' event, providing the like object", () => {
      const eventName = "like";
      const like = {
        broadcastId: faker.number.int(),
        likedByUserId: faker.number.int(),
        likedByUsername: faker.internet.username(),
        likeCount: faker.number.int(),
        likedByUserUUID: randomUUID(),
      };

      streamEmitter.like(like);

      expect(streamEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(streamEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(streamEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toStrictEqual(like);
    });
  });

  describe("newListenersPeak", () => {
    it("emits the 'newListenersPeak' event, providing the current number of listeners", () => {
      const eventName = "listeners_peak";
      const listenersCount = faker.number.int();

      streamEmitter.newListenersPeak(listenersCount);

      expect(streamEmitter.emit).toHaveBeenCalledTimes(1);
      const arg1 = jest.mocked(streamEmitter.emit).mock.calls[0][0];
      const arg2 = jest.mocked(streamEmitter.emit).mock.calls[0][1];
      expect(arg1).toBe(eventName);
      expect(arg2).toBe(listenersCount);
    });
  });
});

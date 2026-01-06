import { describe, it } from "@jest/globals";

describe("streamService", () => {
  describe("readBroadcastState", () => {
    describe("if the stream is in the 'paused' mode", () => {
      it.todo("returns the offline status");
    });

    describe("if the stream is not is the 'paused' mode", () => {
      it.todo("reads the broadcast state");
      it.todo("reads the likes count");
      it.todo("returns the online status and the broadcast data");
    });
  });

  describe("startBroadcast", () => {
    it.todo("creates and saves a new broadcast");
    it.todo("creates and saves a new broadcast stream status");
    it.todo("emits the 'start' event");
  });

  describe("endBroadcast", () => {
    it.todo("emits the 'end' event");
    it.todo("updates the previously saved broadcast");
    it.todo("deletes the saved broadcast stream status");
  });

  describe("updateListenerPeakCount", () => {
    it.todo("reads the listeners peak count");

    describe("if the current listeners peak count is bigger than it was ever before", () => {
      it.todo("updates the listeners peak count");
      it.todo("emits the 'listeners_peak' event");
    });
  });

  describe("readLiveBroadcast", () => {
    it.todo("returns the broaadcast stream status");
  });

  describe("like", () => {
    it.todo("saves the like");
    it.todo("emits the 'like' event");
  });

  describe("readLikesCount", () => {
    it.todo("reads the broadcast id");
    it.todo("finds and returns the likes count");
  });

  describe("buildStreamTitle", () => {
    it.todo("returns the stream title");
  });
});

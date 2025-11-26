import { describe, it } from "@jest/globals";

import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/broadcasts/:broadcastId/messages/:messageId`;

describe(ROUTE, () => {
  describe("DELETE - delete chat message", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the message has been successfuly deleted",
      );

      it.todo(
        "allows the regular user (the one with the role 'streamer') to delete only their own comments",
      );

      it.todo(
        "allows the user with the 'superadmin' role delete anyone's message",
      );
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the path doesn't contain the chat message :id",
      );
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user with the role 'streamer' attempts to delete someone else's message",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if chat message doesn't exist");
    });
  });
});

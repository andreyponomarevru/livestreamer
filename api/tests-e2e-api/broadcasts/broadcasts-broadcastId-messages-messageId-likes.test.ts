import { describe, it } from "@jest/globals";

import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/:broadcastId/messages/:messageId/likes`;

describe(ROUTE, () => {
  describe("POST - like chat message", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the message has been successfuly liked",
      );
      it.todo("allows the user to like his own message");
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the path doesn't contain the broadcast id",
      );

      it.todo(
        "responds with an error if the path doesn't contain the message id",
      );
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("409", () => {
      it.todo("responds with an error if the message has already been liked");
    });
  });

  describe("DELETE - unlike chat message", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body is the message has been successfuly unliked",
      );
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the path doesn't contain the broadcast id",
      );

      it.todo(
        "responds with an error if the path doesn't contain the message :id",
      );
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if the message doesn't exist");
    });
  });
});

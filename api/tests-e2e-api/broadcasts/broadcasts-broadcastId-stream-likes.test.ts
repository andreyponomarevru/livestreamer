import { describe, it } from "@jest/globals";

import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/broadcasts/:broadcastId/stream/likes`;

describe(ROUTE, () => {
  describe("PUT - send like for a stream", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the like has been saved successfully",
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
      it.todo("responds with an error if the broadcast doesn't exist");
    });

    describe("410", () => {
      it.todo(
        "responds with an error if the broadcast currently is not streaming",
      );
    });
  });
});

import { describe, it } from "@jest/globals";

import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/admin/broadcasts/:broadcastId/messages/:messageId`;

describe(ROUTE, () => {
  describe("DELETE - delete a message", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the message has been deleted successfuly",
      );
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the request parameter doesn't contain the :id",
      );
      it.todo(
        "responds with an error if the request query path doesn't contain the :broadcastId",
      );
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it.todo("responds with an error if the user is not authorized");
    });
  });
});

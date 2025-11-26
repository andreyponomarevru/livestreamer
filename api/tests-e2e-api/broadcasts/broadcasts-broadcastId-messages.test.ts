import { describe, it } from "@jest/globals";

import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/broadcast/:broadcastId/messages`;

describe(ROUTE, () => {
  describe("GET - get all chat messages paginated", () => {
    describe("200", () => {
      it.todo("responds with an array of messages paginated");

      it.todo("responds with object containing the pagination cursor");

      it.todo("responds with messages paginated 50 per page");

      it.todo(
        "retrieves messages starting from the 'next_cursor' sent as query parameter in ",
      );

      it.todo(
        "limits the number of messages per pages based on the 'limit' query parameter",
      );
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the query doesn't contain the parameter 'next_cursor'",
      );
    });
  });

  describe("POST", () => {
    describe("204", () => {
      it.todo(
        "responds with a saved message in body if the message has been sent and saved successfuly",
      );
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the body type is not 'application/x-www-form-urlencoded'",
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
  });
});

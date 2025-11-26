import { describe, it } from "@jest/globals";

import { API_URL_PREFIX } from "../../../src/config/env";
import { generateUrlPath } from "../../../test-helpers/helpers";

const ROUTE = `${API_URL_PREFIX}/users/me/broadcasts/:broadcastId`;

// generateUrlPath(":broadcastId", { broadcastId: 1 });

describe(ROUTE, () => {
  describe("DELETE - delete broadcast by id", () => {
    describe("204", () => {
      it.todo("responds with an empty body on successfull delete");
    });
  });

  describe("PATCH - update the broadcast by id", () => {
    describe("204", () => {
      it.todo("responds with an empty body on successful update");
    });
    it.todo("");
  });
});

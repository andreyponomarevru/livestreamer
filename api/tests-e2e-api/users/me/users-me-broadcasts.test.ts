import { describe, it } from "@jest/globals";
import { API_URL_PREFIX } from "../../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/users/me/broadcasts`;

describe(ROUTE, () => {
  describe("GET - get all published broadcasts for the authenticated user", () => {
    describe("200", () => {
      it.todo("responds with a list of all broadcasts");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });
  });

  describe("POST - create a new broadcast", () => {
    describe("200", () => {
      it.todo("responds with a new broadcast");

      // Exampple header to verify: `Location: /users/me/broadcasts/${newBroadcast.broadcastId}`
      it.todo("sets the 'Location' header for the new broadcast");
    });
  });
});

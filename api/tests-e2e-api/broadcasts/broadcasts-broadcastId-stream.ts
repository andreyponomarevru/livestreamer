import { describe, it, beforeAll, afterAll } from "@jest/globals";

import { httpServer } from "../../src/http-server";

const ROUTE = "/broadcasts/:broadcastId/stream";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  describe("GET - pull audio stream from the app to the client", () => {
    describe("200", () => {
      // expect the response body of type "audio/mpeg": { schema: { type: "string", format: "binary" } },
      it.todo(
        "responds with an audio stream of the current broadcast if the stream exists",
      );
      // check for the presence of these headers in the request:
      // expect "cache-control" to be string
      // expect "content-type" to be string
      // expect "transfer-encoding" to be string
      // expect "expires" to be a number
    });

    describe("404", () => {
      it.todo("responds with an error if the broadcast stream doesn't exist");
    });
  });
});

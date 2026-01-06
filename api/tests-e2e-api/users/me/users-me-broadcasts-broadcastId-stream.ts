import { describe, it, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";

import { httpServer } from "../../../src/http-server";
import { generateUrlPath } from "../../../test-helpers/helpers";

const ROUTE = "/users/me/broadcasts/:broadcastId/stream";

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  describe("PUT - send binary audio stream from the authenticated user's streaming client to the app server", () => {
    describe("200", () => {
      it.todo("accepts the 'audio/mpeg' binary stream");
    });

    describe("400", () => {
      it.todo("responds with an error if the body has a non-binary format");
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it.todo("responds with an error if the user is not authorized to stream");

      it.todo(
        "responds with an error if the user is already streaming but attempts to send a second stream",
      );

      it.todo(
        "responds with an error if there is no scheduled broadcast for the current moment",
      );
    });

    describe("404", () => {
      it.todo(
        "responds with an error if there is no broadcast with the provided :broadcastId",
      );
    });

    describe("415", () => {
      it.todo(
        "responds with an error if the body media type is not 'audio/mpeg'",
      );
    });
  });
});

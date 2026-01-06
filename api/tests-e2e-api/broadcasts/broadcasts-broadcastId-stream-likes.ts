import {
  describe,
  it,
  beforeAll,
  afterAll,
  expect,
  beforeEach,
} from "@jest/globals";
import { faker } from "@faker-js/faker";
import * as dateFns from "date-fns";
import request from "supertest";

import { API_URL_PREFIX } from "../../src/config/env";
import { httpServer } from "../../src/http-server";
import {
  createBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  newBroadcast,
  newUser,
} from "../../test-helpers/helpers";
import { redisConnection, type RedisClient } from "../../src/config/redis";

const ROUTE = `${API_URL_PREFIX}/broadcasts/:broadcastId/stream/likes`;

let username: undefined | string;
let password: undefined | string;
let userId: undefined | number;
let broadcastId: undefined | number;

let redisClient: RedisClient;
beforeAll(async () => {
  httpServer.listen();
  redisClient = await redisConnection.open();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

beforeEach(async () => {
  username = faker.internet
    .username()
    .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength)
    .toLocaleLowerCase();
  password = faker.internet.password({
    length: DATABASE_CONSTRAINTS.maxPasswordLength,
  });

  const { appuser_id } = await createUser({
    ...newUser,
    username: username!,
    password: password!,
  });

  userId = appuser_id;

  const from = new Date();
  const to = dateFns.addHours(from, 3);
  const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });

  const { broadcast_id } = await createBroadcast({
    ...newBroadcast,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    userId,
  });

  broadcastId = broadcast_id;
});

describe(ROUTE, () => {
  describe("PUT - like a stream", () => {
    describe("204", () => {
      it("responds with an empty body if the like has been saved", async () => {
        expect(typeof userId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof username).toBe("string");

        const sessionsBeforeSignIn = await redisClient.keys(
          `broadcaststream:${userId}:${broadcastId}`,
        );
        expect(sessionsBeforeSignIn.length).toBe(0);

        // TODO

        // ... Start stream ...

        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username,
          password,
        });

        // ... Send like for the stream + check response ...

        // ... Check Postgres if the like has been saved ...
      });
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

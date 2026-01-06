import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
} from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";
import * as dateFns from "date-fns";

import { httpServer } from "../../src/http-server";
import {
  createBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  generateUrlPath,
} from "../../test-helpers/helpers";
import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/users/:username/broadcasts`;

let testUserId: undefined | number;
let testUserUsername: undefined | string;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

beforeEach(async () => {
  testUserUsername = faker.internet
    .username()
    .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength)
    .toLocaleLowerCase();

  const { appuser_id } = await createUser({
    roleId: 2,
    username: testUserUsername,
    password: faker.internet
      .password()
      .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength),
    email: faker.internet.email(),
    isEmailConfirmed: true,
    isDeleted: false,
  });

  testUserId = appuser_id;
});

describe(ROUTE, () => {
  const from = new Date();
  const to = dateFns.addHours(from, 3);
  const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });
  const broadcast = {
    title: faker.book
      .title()
      .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle),
    isVisible: true,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    artworkUrl: faker.system.filePath(),
    description: faker.lorem.paragraphs(),
    listenerPeakCount: faker.number.int({ min: 0, max: 10000 }),
  };

  describe("GET - get publicly available broadcasts by username", () => {
    describe("200", () => {
      it("responds with a list of publicly available user broadcasts", async () => {
        expect(typeof testUserId === "number").toBe(true);

        await createBroadcast({ ...broadcast, userId: testUserId! });

        const route = generateUrlPath(ROUTE, { username: testUserUsername });
        const response = await request(httpServer)
          .get(route)
          .send(broadcast)
          .expect(200);

        expect(response.body).toStrictEqual({
          results: [
            {
              broadcastId: expect.any(Number),
              title: broadcast.title,
              startAt: broadcast.startAt,
              endAt: broadcast.endAt,
              artworkUrl: broadcast.artworkUrl,
              description: broadcast.description,
              listenerPeakCount: broadcast.listenerPeakCount,
              isVisible: broadcast.isVisible,
              likeCount: 0,
              userId: testUserId,
            },
          ],
        });
      });

      describe("'time' query param", () => {
        it.todo(
          "responds with a list of past broadcasts when the query param is '?time=past",
        );
        it.todo(
          "responds with a list of current broadcasts when the query param is '?time=current",
        );
        it.todo(
          "responds with a list of future broadcasts when the query param is '?time=future",
        );
      });
    });
  });
});

import path from "path";
import fs from "fs";

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

import { API_URL_PREFIX } from "../../../src/config/env";
import { httpServer } from "../../../src/http-server";
import {
  createBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
} from "../../../test-helpers/helpers";
import { dbConnection } from "../../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/users/me/broadcasts`;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

let username: undefined | string;
let password: undefined | string;
let userId: undefined | number;

beforeEach(async () => {
  username = faker.internet
    .username()
    .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength)
    .toLocaleLowerCase();
  password = faker.internet
    .password()
    .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength);

  const { appuser_id } = await createUser({
    roleId: 2,
    username: username!,
    password: password!,
    email: faker.internet.email(),
    displayName: faker.internet
      .displayName()
      .substring(0, DATABASE_CONSTRAINTS.maxDisplayName),
    isEmailConfirmed: true,
    isDeleted: false,
    profilePictureUrl: faker.internet.url(),
    about: faker.lorem.paragraphs(),
  });

  userId = appuser_id;
});

describe(ROUTE, () => {
  describe("GET - get all existing broadcasts for the authenticated user", () => {
    describe("200", () => {
      it("responds with a list of all broadcasts", async () => {
        for (let i = 0; i < 30; i++) {
          const from = faker.date.anytime();
          const to = dateFns.addHours(from, 3);
          const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });
          const broadcast = {
            userId: userId!,
            title: faker.lorem
              .sentence()
              .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle),
            isVisible: faker.datatype.boolean(),
            artworkUrl: faker.internet.url(),
            description: faker.lorem.paragraphs(),
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
            listenerPeakCount: faker.number.int(100000),
          };

          await createBroadcast(broadcast);
        }

        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username, password })
          .expect(200);

        const response = await agent.get(ROUTE).expect(200);
        expect(response.body).toStrictEqual({ results: expect.any(Array) });
        expect(response.body?.results).toHaveLength(30);
      });
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });
  });

  describe("POST - create a new broadcast", () => {
    describe("200", () => {
      it.only("responds with a new broadcast", async () => {
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username, password })
          .expect(200);

        const from = new Date();
        const to = dateFns.addHours(from, 3);
        const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });
        const newBroadcast = {
          title: faker.book
            .title()
            .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle),
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          description: faker.lorem.paragraphs(),
        };

        const imgPath = path.resolve(
          __dirname,
          "../../../test-helpers/test-data/broadcast-artwork.jpg",
        );
        expect(fs.existsSync(imgPath)).toBe(true);

        const response = await agent
          .post(ROUTE)
          .field("broadcast", JSON.stringify(newBroadcast))
          .attach("artwork", imgPath)
          .expect(200);

        expect(response.body).toStrictEqual({
          results: {
            broadcastId: expect.any(Number),
            likeCount: 0,
            userId,
            title: newBroadcast.title,
            isVisible: true,
            artworkUrl: expect.stringMatching(
              "/home/node/uploads/broadcast-artworks/",
            ),
            description: newBroadcast.description,
            startAt: newBroadcast.startAt,
            endAt: newBroadcast.endAt,
            listenerPeakCount: 0,
          },
        });

        const pool = await dbConnection.open();
        const dbResponse = await pool.query(
          `SELECT * FROM view_broadcast WHERE appuser_id = $1`,
          [userId],
        );
        expect(dbResponse.rows).toHaveLength(1);
        expect(dbResponse.rows[0]).toStrictEqual({
          broadcast_id: expect.any(Number),
          like_count: "0",
          appuser_id: userId,
          username,
          title: newBroadcast.title,
          is_visible: true,
          artwork_url: expect.stringMatching(
            "/home/node/uploads/broadcast-artworks/",
          ),
          description: newBroadcast.description,
          start_at: startAt,
          end_at: endAt,
          listener_peak_count: 0,
        });
      });

      it.todo("accepts only only PNG and JPG with max size of 10MB");

      // Exampple header to verify: `Location: /users/me/broadcasts/${newBroadcast.broadcastId}`
      it.todo("sets the 'Location' header for the new broadcast");
    });
  });
});

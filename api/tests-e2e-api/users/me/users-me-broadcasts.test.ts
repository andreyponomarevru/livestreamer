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
  BROADCAST_IMG_PATH,
  createBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  newUser,
} from "../../../test-helpers/helpers";
import { dbConnection } from "../../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/users/me/broadcasts`;

let username: undefined | string;
let password: undefined | string;
let userId: undefined | number;

beforeAll(async () => {
  httpServer.listen();
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
  password = faker.internet
    .password()
    .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength);

  const { appuser_id } = await createUser({
    ...newUser,
    username: username!,
    password: password!,
  });

  userId = appuser_id;
});

describe(ROUTE, () => {
  describe("GET - get all existing broadcasts for the authenticated user", () => {
    describe("200", () => {
      it("responds with a list of sorted broadcasts", async () => {
        const totalBroadcasts = 5;
        for (let i = 0; i < totalBroadcasts; i++) {
          const from = faker.date.anytime();
          const to = dateFns.addHours(from, 3);
          const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });
          const broadcast = {
            userId: userId!,
            title: faker.lorem
              .sentence()
              .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle),
            isVisible: faker.datatype.boolean(),
            artworkUrl: faker.system.fileName(),
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
        expect(response.body).toStrictEqual({
          results: {
            past: expect.any(Array),
            current: expect.any(Array),
            future: expect.any(Array),
          },
        });
      });

      it.todo("sorts broadcasts into three groups: past, current and future");

      it("sets the broadcast artworkUrl field in reponse relative to API upload dir", async () => {
        const from = faker.date.future();
        const to = dateFns.addHours(from, 3);
        const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });
        const broadcast = {
          userId: userId!,
          title: faker.lorem
            .sentence()
            .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle),
          isVisible: faker.datatype.boolean(),
          artworkUrl: faker.system.fileName(),
          description: faker.lorem.paragraphs(),
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          listenerPeakCount: faker.number.int(100000),
        };

        await createBroadcast(broadcast);

        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username, password })
          .expect(200);

        const response = await agent.get(ROUTE).expect(200);
        expect(response.body.results.future).toHaveLength(1);
        expect(response.body.results.future[0]).toHaveProperty("artworkUrl");
        expect(response.body.results.future[0].artworkUrl).toMatch(
          BROADCAST_IMG_PATH,
        );
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
      it("responds with a new broadcast", async () => {
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

        const imgPath = path.resolve(__dirname, "./broadcast-artwork.jpg");
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
            artworkUrl: expect.any(String),
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
          artwork_url: expect.any(String),
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

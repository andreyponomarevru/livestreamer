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
import request from "supertest";
import { faker } from "@faker-js/faker";
import * as dateFns from "date-fns";

import { API_URL_PREFIX } from "../../../src/config/env";
import {
  createBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  generateUrlPath,
} from "../../../test-helpers/helpers";
import { httpServer } from "../../../src/http-server";
import { dbConnection } from "../../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/users/me/broadcasts/:broadcastId`;

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
    roleId: 2,
    username: username!,
    password: password!,
    email: faker.internet.email(),
    displayName: faker.internet
      .displayName()
      .substring(0, DATABASE_CONSTRAINTS.maxDisplayName),
    isEmailConfirmed: true,
    isDeleted: false,
    profilePictureUrl: faker.system.filePath(),
    about: faker.lorem.paragraphs(),
  });

  userId = appuser_id;
});

describe(ROUTE, () => {
  describe("DELETE - delete broadcast by id", () => {
    describe("204", () => {
      it("responds with an empty body on successfull delete", async () => {
        const from = faker.date.anytime();
        const to = dateFns.addHours(from, 3);
        const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });

        const newBroadcast = await createBroadcast({
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
        });

        const pool = await dbConnection.open();
        const savedBroadcast = await pool.query(
          `SELECT 1 FROM view_broadcast WHERE appuser_id = $1`,
          [userId],
        );
        expect(savedBroadcast.rows).toHaveLength(1);

        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username, password })
          .expect(200);

        await agent
          .delete(
            generateUrlPath(
              `${API_URL_PREFIX}/users/me/broadcasts/:broadcastId`,
              { broadcastId: newBroadcast.broadcast_id },
            ),
          )
          .expect(204);

        const deletedBroadcast = await pool.query(
          "SELECT 1 FROM broadcast WHERE broadcast_id = $1",
          [newBroadcast.broadcast_id],
        );
        expect(deletedBroadcast.rows).toHaveLength(0);
      });
    });
  });

  describe("PATCH - update the broadcast by id", () => {
    describe("204", () => {
      it("responds with an empty body on successful update", async () => {
        const from = faker.date.anytime();
        const to = dateFns.addHours(from, 3);
        const [startAt, endAt] = faker.date.betweens({ from, to, count: 2 });

        const savedBroadcast = await createBroadcast({
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
        });
        expect(typeof savedBroadcast.broadcast_id).toBe("number");

        const pool = await dbConnection.open();
        const dbResponse = await pool.query(
          `SELECT 1 FROM view_broadcast WHERE appuser_id = $1`,
          [userId],
        );
        expect(dbResponse.rows).toHaveLength(1);

        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username, password })
          .expect(200);

        const from2 = faker.date.anytime();
        const to2 = dateFns.addHours(from2, 3);
        const [updatedStartAt2, updatedEndAt2] = faker.date.betweens({
          from: from2,
          to: to2,
          count: 2,
        });
        const updatedTitle = faker.lorem
          .sentence()
          .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle);
        const updatedIsVisible = faker.datatype.boolean();
        const updatedDescription = faker.lorem.paragraphs();
        const imgPath = path.resolve(__dirname, "./broadcast-artwork-2.jpg");
        expect(fs.existsSync(imgPath)).toBe(true);

        const route = generateUrlPath(
          `${API_URL_PREFIX}/users/me/broadcasts/:broadcastId`,
          { broadcastId: savedBroadcast.broadcast_id },
        );

        await agent
          .patch(route)
          .field(
            "broadcast",
            JSON.stringify({
              title: updatedTitle,
              startAt: updatedStartAt2,
              endAt: updatedEndAt2,
              description: updatedDescription,
              isVisible: updatedIsVisible,
            }),
          )
          .attach("artwork", imgPath)
          .expect(204);

        const updatedBroadcast = await pool.query(
          "SELECT * FROM broadcast WHERE broadcast_id = $1",
          [savedBroadcast.broadcast_id],
        );
        expect(updatedBroadcast.rows).toHaveLength(1);
        expect(updatedBroadcast.rows[0]).toStrictEqual({
          broadcast_id: savedBroadcast.broadcast_id,
          appuser_id: userId,
          title: updatedTitle,
          start_at: updatedStartAt2,
          end_at: updatedEndAt2,
          artwork_url: expect.any(String),
          description: updatedDescription,
          listener_peak_count: expect.any(Number),
          is_visible: updatedIsVisible,
        });
      });
    });
  });
});

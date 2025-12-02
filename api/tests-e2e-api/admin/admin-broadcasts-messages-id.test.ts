import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
} from "@jest/globals";
import { faker } from "@faker-js/faker";
import request from "supertest";
import * as dateFns from "date-fns";

import { API_URL_PREFIX } from "../../src/config/env";
import { httpServer } from "../../src/http-server";
import {
  createBroadcast,
  createChatMessageForBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  generateUrlPath,
} from "../../test-helpers/helpers";
import { superadminUser } from "../../test-helpers/jest-hooks/utils/user";
import { dbConnection } from "../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/admin/broadcasts/:broadcastId/messages/:messageId`;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  describe("DELETE - user with role superadmin can delete chat message of user with role broadcaster", () => {
    let testUserId: undefined | number;
    let testUserUsername: undefined | string;
    let broadcastId: undefined | number;

    describe("204", () => {
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
          displayName: faker.internet
            .displayName()
            .substring(0, DATABASE_CONSTRAINTS.maxDisplayName),
          isEmailConfirmed: true,
          isDeleted: false,
          profilePictureUrl: faker.internet.url(),
          about: faker.lorem.paragraphs(),
        });
        testUserId = appuser_id;

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
          artworkUrl: faker.internet.url(),
          description: faker.lorem.paragraphs(),
          listenerPeakCount: faker.number.int({ min: 0, max: 10000 }),
        };
        const { broadcast_id } = await createBroadcast({
          ...broadcast,
          userId: testUserId!,
        });
        broadcastId = broadcast_id;
      });

      it("responds with an empty body if the message has been deleted successfuly", async () => {
        expect(typeof testUserId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof testUserUsername).toBe("string");

        const message = {
          message: faker.lorem.sentence(),
          broadcastId: broadcastId!,
          userId: testUserId!,
        };
        const { message_id } = await createChatMessageForBroadcast(message);
        expect(typeof message_id).toBe("number");

        const route = generateUrlPath(
          `${API_URL_PREFIX}/admin/broadcasts/:broadcastId/messages/:messageId`,
          { broadcastId, messageId: message_id },
        );
        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username: superadminUser.username,
          password: superadminUser.password,
        });
        await agent.delete(route).send().expect(204);

        const pool = await dbConnection.open();
        const deletedBroadcastRes = await pool.query(
          `SELECT * FROM chat_message WHERE broadcast_id = $1 AND chat_message_id = $2`,
          [broadcastId, message_id],
        );
        expect(deletedBroadcastRes.rows).toHaveLength(0);
      });
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the request parameter doesn't contain the :id",
      );
      it.todo(
        "responds with an error if the request query path doesn't contain the :broadcastId",
      );
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it.todo("responds with an error if the user is not authorized");
    });
  });
});

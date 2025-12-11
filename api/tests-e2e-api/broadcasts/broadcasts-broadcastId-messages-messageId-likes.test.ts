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
import {
  createBroadcast,
  createChatMessageForBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  generateUrlPath,
  newBroadcast,
  newUser,
} from "../../test-helpers/helpers";
import { httpServer } from "../../src/http-server";
import { dbConnection } from "../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/broadcasts/:broadcastId/messages/:messageId/likes`;

let username: undefined | string;
let password: undefined | string;
let userId: undefined | number;
let broadcastId: undefined | number;

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
  describe("POST - like chat message", () => {
    describe("204", () => {
      it("responds with an empty body if the like has been saved", async () => {
        expect(typeof userId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof username).toBe("string");

        const message = {
          message: faker.lorem.sentence(),
          broadcastId: broadcastId!,
          userId: userId!,
        };
        const { message_id } = await createChatMessageForBroadcast(message);
        expect(typeof message_id).toBe("number");

        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username,
          password,
        });

        const route = generateUrlPath(ROUTE, {
          broadcastId,
          messageId: message_id,
        });
        await agent.post(route).expect(204);

        const pool = await dbConnection.open();
        const chatMessage = await pool.query(
          `SELECT 1 FROM chat_message_like WHERE chat_message_id = $1 AND appuser_id = $2`,
          [message_id, userId],
        );
        expect(chatMessage.rows).toHaveLength(1);
      });
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the path doesn't contain the broadcast id",
      );

      it.todo(
        "responds with an error if the path doesn't contain the message id",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("409", () => {
      it("responds with an error if the message has already been liked", async () => {
        expect(typeof userId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof username).toBe("string");

        const { message_id } = await createChatMessageForBroadcast({
          message: faker.lorem.sentence(),
          broadcastId: broadcastId!,
          userId: userId!,
        });
        expect(typeof message_id).toBe("number");

        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username,
          password,
        });

        const route = generateUrlPath(ROUTE, {
          broadcastId,
          messageId: message_id,
        });
        await agent.post(route).expect(204);
        await agent.post(route).expect(409);

        const pool = await dbConnection.open();
        const chatMessage = await pool.query(
          `SELECT 1 FROM chat_message_like WHERE chat_message_id = $1 AND appuser_id = $2`,
          [message_id, userId],
        );
        expect(chatMessage.rows).toHaveLength(1);
      });
    });
  });

  describe("DELETE - unlike chat message", () => {
    describe("204", () => {
      it("responds with an empty body if the like has been removed", async () => {
        expect(typeof userId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof username).toBe("string");

        const message = {
          message: faker.lorem.sentence(),
          broadcastId: broadcastId!,
          userId: userId!,
        };
        const { message_id } = await createChatMessageForBroadcast(message);
        expect(typeof message_id).toBe("number");

        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username,
          password,
        });

        const pool = await dbConnection.open();
        const insertDBRes = await pool.query(
          `INSERT INTO 
              chat_message_like (appuser_id, chat_message_id)
            VALUES 
              ($1, $2)
            RETURNING 1`,
          [userId, message_id],
        );
        expect(insertDBRes.rows).toHaveLength(1);

        await agent
          .delete(
            generateUrlPath(ROUTE, {
              broadcastId,
              messageId: message_id,
            }),
          )
          .expect(204);

        const selectDeletedDBRes = await pool.query(
          `SELECT 1 FROM chat_message_like WHERE appuser_id = $1 AND chat_message_id = $2`,
          [userId, message_id],
        );
        expect(selectDeletedDBRes.rows).toHaveLength(0);
      });
    });

    describe("400", () => {
      it.todo("responds with an error if :broadcastId is not a number");
      it.todo(
        "responds with an error if the path doesn't contain the message :id",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if the message doesn't exist");
    });
  });
});

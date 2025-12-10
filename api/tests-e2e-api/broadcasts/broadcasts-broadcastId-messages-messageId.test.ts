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

import { dbConnection } from "../../src/config/postgres";
import { API_URL_PREFIX } from "../../src/config/env";
import { httpServer } from "../../src/http-server";
import {
  createBroadcast,
  createChatMessageForBroadcast,
  createUser,
  DATABASE_CONSTRAINTS,
  generateUrlPath,
} from "../../test-helpers/helpers";

const ROUTE = `${API_URL_PREFIX}/broadcasts/:broadcastId/messages/:messageId`;

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
    userId,
  });

  broadcastId = broadcast_id;
});

describe(ROUTE, () => {
  describe("DELETE - delete chat message", () => {
    describe("204", () => {
      it("responds with an empty body if the message has been successfuly deleted", async () => {
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
        await agent.delete(route).expect(204);

        const pool = await dbConnection.open();
        const chatMessage = await pool.query(
          `SELECT * FROM chat_message WHERE broadcast_id = $1 AND appuser_id = $2`,
          [broadcastId, userId],
        );
        expect(chatMessage.rows).toHaveLength(0);
      });
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the path doesn't contain the chat message :id",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user attempts to delete not his own message",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if chat message doesn't exist");
    });
  });
});

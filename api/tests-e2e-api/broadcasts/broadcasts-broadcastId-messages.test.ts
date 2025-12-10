import {
  describe,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  expect,
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

const ROUTE = `${API_URL_PREFIX}/broadcasts/:broadcastId/messages`;
const API_DEFAULT_RESPONSE_MESSAGE_LIMIT = 20;

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
  describe("GET - get chat messages for specific broadcast", () => {
    describe("200", () => {
      it("responds with an array of messages and nextCursor field", async () => {
        expect(typeof userId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof username).toBe("string");

        const messages: {
          message: string;
          broadcastId: number;
          userId: number;
        }[] = [];

        const messagesTotal = 50;
        for (let i = 0; i < messagesTotal; i++) {
          const message = {
            message: faker.lorem.sentence(),
            broadcastId: broadcastId!,
            userId: userId!,
          };
          const { message_id } = await createChatMessageForBroadcast(message);
          expect(typeof message_id).toBe("number");

          messages.push(message);
        }

        const pool = await dbConnection.open();
        const chatMessages = await pool.query(
          `SELECT * FROM chat_message WHERE broadcast_id = $1 AND appuser_id = $2`,
          [broadcastId, userId],
        );
        expect(chatMessages.rows).toHaveLength(messagesTotal);
        messages.forEach((msg, index) => {
          expect(chatMessages.rows[index]).toStrictEqual({
            appuser_id: userId,
            broadcast_id: broadcastId,
            chat_message_id: expect.any(Number),
            created_at: expect.any(Date),
            message: msg.message,
          });
        });

        const agent = request.agent(httpServer);
        const route = generateUrlPath(ROUTE, { broadcastId });
        const getMessagesRes = await agent.get(route).send().expect(200);

        expect(getMessagesRes.body).toStrictEqual({
          results: {
            nextCursor: expect.any(String),
            messages: expect.any(Array),
          },
        });
        expect(getMessagesRes.body.results.messages).toHaveLength(
          API_DEFAULT_RESPONSE_MESSAGE_LIMIT,
        );
      });

      it.todo("respons contains the pagination cursor");

      it.todo("responds with messages paginated N per page");

      it.todo(
        "retrieves messages starting from the 'next_cursor' sent as query parameter in ",
      );

      it("limits the number of messages per pages based on the 'limit' query parameter", async () => {
        expect(typeof userId).toBe("number");
        expect(typeof broadcastId).toBe("number");
        expect(typeof username).toBe("string");

        const messages: {
          message: string;
          broadcastId: number;
          userId: number;
        }[] = [];
        for (let i = 0; i < 50; i++) {
          const message = {
            message: faker.lorem.sentence(),
            broadcastId: broadcastId!,
            userId: userId!,
          };
          const { message_id } = await createChatMessageForBroadcast(message);
          expect(typeof message_id).toBe("number");

          messages.push(message);
        }

        const agent = request.agent(httpServer);
        const LIMIT = 10;
        const route = `${generateUrlPath(ROUTE, { broadcastId })}?limit=${LIMIT}`;
        const getMessagesRes = await agent.get(route).send().expect(200);

        expect(getMessagesRes.body).toEqual({
          results: expect.objectContaining({ messages: expect.any(Array) }),
        });
        expect(getMessagesRes.body.results.messages).toHaveLength(LIMIT);
      });
    });

    describe("400", () => {
      it.todo("responds with an error if the :broadcastId is not a number");
      it.todo("responds with an error if the message is longer than 500 chars");
      it.todo("responds with an error if the message is empty string");
    });

    describe("404", () => {
      it.todo("responds with an error if the :broadcastId doesn't exist");
    });
  });

  describe("POST", () => {
    describe("204", () => {
      it("responds with a saved message in body if the message has been saved successfuly", async () => {
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

        const pool = await dbConnection.open();
        const chatMessages = await pool.query(
          `SELECT * FROM chat_message WHERE broadcast_id = $1 AND appuser_id = $2`,
          [broadcastId, userId],
        );
        expect(chatMessages.rows).toHaveLength(1);
        expect(chatMessages.rows[0]).toStrictEqual({
          appuser_id: userId,
          broadcast_id: broadcastId,
          chat_message_id: message_id,
          created_at: expect.any(Date),
          message: message.message,
        });

        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username,
          password,
        });
        const route = generateUrlPath(ROUTE, { broadcastId });
        const postMessagesRes = await agent
          .post(route)
          .send({ message: message.message })
          .expect(201);

        expect(postMessagesRes.body).toStrictEqual({
          results: {
            userId,
            broadcastId,
            messageId: expect.any(Number),
            createdAt: expect.any(String),
            message: message.message,
            likedByUserId: [],
            username,
            userUUID: expect.any(String),
          },
        });
      });
    });

    describe("400", () => {
      it.todo("responds with an error if the broadcastId is not a number");
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have permission to post messages",
      );
    });

    describe("404", () => {
      it.todo("responds with an error if the :broadcastId doesn't exist");
    });
  });
});

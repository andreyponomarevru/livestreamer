import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../../../src/http-server";
import {
  createUser,
  DATABASE_CONSTRAINTS,
} from "../../../test-helpers/helpers";
import { API_URL_PREFIX } from "../../../src/config/env";
import { dbConnection } from "../../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/users/me`;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  const testUser = {
    roleId: 2,
    username: faker.internet
      .username()
      .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength),
    password: faker.internet
      .password()
      .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength),
    email: faker.internet.email(),
    profilePictureUrl: faker.system.filePath(),
    isDeleted: false,
    isEmailConfirmed: true,
    displayName: faker.internet
      .username()
      .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength),
  };

  describe(`DELETE - delete user account`, () => {
    describe("204", () => {
      it("allows the user with role 'broadcaster' (role_id=2) to soft delete his own account", async () => {
        await createUser(testUser);
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username: testUser.username, password: testUser.password })
          .expect(200);

        await agent.delete(ROUTE).expect(204);
        const pool = await dbConnection.open();
        const dbResponse = await pool.query(
          `SELECT * FROM appuser WHERE username = '${testUser.username}'`,
        );

        expect(dbResponse.rows.length).toBe(1);
        expect(dbResponse.rows[0].is_deleted).toBe(true);
      });
    });
  });

  describe(`PATCH - update user account`, () => {
    describe("200", () => {
      it("responds with an updated user object", async () => {
        await createUser(testUser);
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username: testUser.username, password: testUser.password })
          .expect(200);
        const newUsername = faker.internet
          .username()
          .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength);

        const response = await agent
          .patch(ROUTE)
          .send({ username: newUsername })
          .expect(200);

        expect(response.body).toStrictEqual({
          results: {
            email: testUser.email,
            username: newUsername,
            userId: expect.any(Number),
            uuid: expect.any(String),
            permissions: {
              own_audio_stream: ["create", "delete", "read", "update"],
              any_broadcast: ["read"],
              own_broadcast: ["create", "delete", "read", "update"],
              own_user_account: ["create", "delete", "read", "update"],
              own_chat_message: ["create", "delete", "read"],
            },
          },
        });
      });
    });

    describe("409", () => {
      it("responds with an error if the user with the submited username already exists", async () => {
        await createUser(testUser);
        const user2 = {
          username: faker.internet
            .username()
            .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength),
          password: faker.internet
            .password()
            .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength),
          email: faker.internet.email(),
        };
        await createUser({ ...testUser, ...user2 });
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .send({ username: user2.username, password: user2.password })
          .expect(200);

        const response = await agent
          .patch(ROUTE)
          .send({ username: testUser.username })
          .expect(409);

        expect(response.body).toStrictEqual({
          message: "Sorry, this username is already taken",
          moreInfo: "https://github.com/ponomarevandrey/",
          status: 409,
          statusText: "Conflict",
        });
      });
    });
  });
});

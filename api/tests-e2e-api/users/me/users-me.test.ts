import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../../../src/http-server";
import { createUser } from "../../../test-helpers/helpers";
import { API_URL_PREFIX } from "../../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/users/me`;

const maxUsernameLength = 16;
const maxPasswordLength = 50;
const maxDisplayName = 32;

describe(ROUTE, () => {
  const username = faker.internet.username().substring(0, maxUsernameLength);
  const password = faker.internet.password().substring(0, maxPasswordLength);
  const email = faker.internet.email();
  const profilePictureUrl = faker.system.filePath();
  const displayName = faker.internet.displayName().substring(0, maxDisplayName);

  describe(`DELETE - delete user account`, () => {
    describe("204", () => {
      it("allows the user with role 'broadcaster' to delete his own account", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
          displayName,
          profilePictureUrl,
        });
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .set("accept", "application/json")
          .send({ username, password })
          .expect(200);

        await agent.delete(ROUTE).expect(204);
      });
    });
  });

  describe(`GET - get user account`, () => {
    describe("200", () => {
      it("responds with authenticated user object", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
          displayName,
          profilePictureUrl,
        });
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .set("accept", "application/json")
          .send({ username, password })
          .expect(200);

        const response = await agent.get(ROUTE).expect(200);
        expect(response.body).toStrictEqual({
          results: {
            email,
            username,
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
  });

  describe(`PATCH - update user account`, () => {
    describe("200", () => {
      it("responds with an updated user object", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
          displayName,
          profilePictureUrl,
        });
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .set("accept", "application/json")
          .send({ username, password })
          .expect(200);
        const newUsername = faker.internet
          .username()
          .substring(0, maxUsernameLength);

        const response = await agent
          .patch(ROUTE)
          .send({ username: newUsername })
          .expect(200);

        expect(response.body).toStrictEqual({
          results: {
            email,
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
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
          displayName,
          profilePictureUrl,
        });
        const user2 = {
          username: faker.internet.username().substring(0, maxUsernameLength),
          password: faker.internet.password().substring(0, maxPasswordLength),
        };
        await createUser({
          ...user2,
          email: faker.internet.email(),
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: true,
          displayName,
          profilePictureUrl,
        });
        const agent = request.agent(httpServer);
        await agent
          .post(`${API_URL_PREFIX}/sessions`)
          .set("accept", "application/json")
          .send({ username: user2.username, password: user2.password })
          .expect(200);

        const response = await agent
          .patch(ROUTE)
          .send({ username })
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

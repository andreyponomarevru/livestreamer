import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../../src/http-server";
import {
  createUser,
  generateUrlPath,
  DATABASE_CONSTRAINTS,
} from "../../test-helpers/helpers";
import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/users/:username`;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  describe("GET - get public user profile by username", () => {
    describe("200", () => {
      const testUser = {
        roleId: 2,
        username: faker.internet
          .username()
          .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength),
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
      };

      it("responds with public user profile", async () => {
        await createUser(testUser);
        const response = await request(httpServer)
          .get(generateUrlPath(ROUTE, { username: testUser.username }))
          .send({
            username: testUser.username,
            password: testUser.password,
          });

        expect(response.body).toStrictEqual({
          results: {
            uuid: expect.any(String),
            userId: expect.any(Number),
            username: testUser.username,
            email: testUser.email,
            displayName: testUser.displayName,
            isEmailConfirmed: testUser.isEmailConfirmed,
            profilePictureUrl: testUser.profilePictureUrl,
            about: testUser.about,
            createdAt: expect.any(String),
            lastLoginAt: null,
            subscriptionName: "",
            websiteUrl: "",
            permissions: {
              own_audio_stream: ["create", "delete", "read", "update"],
              own_user_account: ["create", "delete", "read", "update"],
              own_broadcast: ["create", "delete", "read", "update"],
              any_broadcast: ["read"],
              own_chat_message: ["create", "delete", "read"],
            },
          },
        });
      });
    });
  });
});

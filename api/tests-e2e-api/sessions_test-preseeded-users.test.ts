import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";

import {
  broadcasterUser,
  superadminUser,
} from "../test-helpers/jest-hooks/utils/user";
import { httpServer } from "../src/http-server";
import { API_URL_PREFIX } from "../src/config/env";

const ROUTE = `${API_URL_PREFIX}/sessions`;

const sessionCookieResponse = [
  {
    name: "sess.sid",
    httpOnly: true,
    sameSite: "Strict",
    path: "/",
    value: expect.any(String),
    expires: expect.any(Date),
  },
];
// Required because setCookie.parse returns an object with prototype set to null
Object.setPrototypeOf(sessionCookieResponse[0], null);

beforeAll(async () => {
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe(`${ROUTE} (for the pre-seeded user with the role superadmin)`, () => {
  describe("POST - sign in", () => {
    describe("200", () => {
      it("signs the user in with username and password and responds with user object", async () => {
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: superadminUser.username,
            password: superadminUser.password,
          })
          .expect("content-type", /json/)
          .expect(200);

        expect(response.body).toStrictEqual({
          results: {
            uuid: expect.any(String),
            userId: 1,
            email: superadminUser.email,
            username: superadminUser.username,
            displayName: superadminUser.displayName,
            createdAt: expect.any(String),
            lastLoginAt: expect.any(String),
            isEmailConfirmed: superadminUser.isEmailConfirmed,
            profilePictureUrl: superadminUser.profilePictureUrl,
            websiteUrl: superadminUser.websiteUrl,
            subscriptionName: superadminUser.subscriptionName,
            about: superadminUser.about,
            permissions: {
              any_audio_stream: ["create", "delete", "read", "update"],
              own_broadcast: ["create", "delete", "read", "update"],
              any_broadcast: ["create", "delete", "read", "update"],
              own_user_account: ["read", "update"],
              any_user_account: ["delete", "read", "update"],
              any_chat_message: ["delete"],
            },
          },
        });
      });
    });
  });
});

describe("/sessions (for the pre-seeded user with the role streamer)", () => {
  describe("POST - sign in", () => {
    describe("200", () => {
      it("signs the user in with username and password and responds with user object", async () => {
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: broadcasterUser.username,
            password: broadcasterUser.password,
          })
          .expect("content-type", /json/)
          .expect(200);

        expect(response.body).toStrictEqual({
          results: {
            uuid: expect.any(String),
            userId: expect.any(Number),
            email: broadcasterUser.email,
            username: broadcasterUser.username,
            about: broadcasterUser.about,
            createdAt: expect.any(String),
            lastLoginAt: expect.any(String),
            isEmailConfirmed: broadcasterUser.isEmailConfirmed,
            displayName: broadcasterUser.displayName,
            websiteUrl: broadcasterUser.websiteUrl,
            profilePictureUrl: broadcasterUser.profilePictureUrl,
            subscriptionName: broadcasterUser.subscriptionName,
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

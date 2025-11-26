import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import setCookie from "set-cookie-parser";

import {
  broadcasterUser,
  superadminUser,
} from "../test-helpers/jest-hooks/utils/user";
import { httpServer } from "../src/http-server";
import { RedisClient, redisConnection } from "../src/config/redis";
import { MORE_INFO, RESPONSE_401 } from "../test-helpers/helpers";
import { signIn } from "../test-helpers/helpers";
import { API_URL_PREFIX } from "../src/config/env";

const ROUTE = `${API_URL_PREFIX}/sessions`;

const sessionKeyPattern = "sess:*";
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

let redisClient: RedisClient;
beforeAll(async () => {
  redisClient = await redisConnection.open();
  httpServer.listen();
});

afterAll(() => {
  httpServer.close((err) => {
    if (err) throw err;
  });
});

describe(`${ROUTE} (for the pre-seeded user with the role Superadmin)`, () => {
  const superadminUserResponse = {
    results: {
      uuid: expect.any(String),
      userId: 1,
      email: "system.andreyponomarev@yandex.ru",
      username: "hal",
      permissions: {
        any_audio_stream: ["create", "delete", "read", "update"],
        own_broadcast: ["create", "delete", "read", "update"],
        any_broadcast: ["create", "delete", "read", "update"],
        own_user_account: ["read", "update"],
        any_user_account: ["delete", "read", "update"],
        any_chat_message: ["delete"],
      },
    },
  };

  describe("POST - sign in", () => {
    describe("200", () => {
      it("signs the user in, creating a cookie session", async () => {
        const sessionsBeforeSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsBeforeSignIn.length).toBe(0);

        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: superadminUser.username,
            password: superadminUser.password,
          })
          .expect(200);

        expect(setCookie.parse(response.headers["set-cookie"])).toStrictEqual(
          sessionCookieResponse,
        );

        const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignIn.length).toBe(1);
      });

      describe("signs the user in, responding with the user object if", () => {
        it("the user provides username and password", async () => {
          const response = await request(httpServer)
            .post(ROUTE)
            .send({
              username: superadminUser.username,
              password: superadminUser.password,
            })
            .expect("content-type", /json/)
            .expect(200);

          expect(response.body).toStrictEqual(superadminUserResponse);
        });

        it("the user provides email and password", async () => {
          const response = await request(httpServer)
            .post(ROUTE)
            .send({
              username: superadminUser.username,
              password: superadminUser.password,
            })
            .expect("content-type", /json/)
            .expect(200);

          expect(response.body).toStrictEqual(superadminUserResponse);
        });
      });
    });

    describe("401", () => {
      it("responds with an error if credentials are invalid", async () => {
        const response = await request(httpServer)
          .post(ROUTE)
          .send({ username: "invalid", password: "invalid" })
          .expect("content-type", /json/)
          .expect(401);

        expect(response.body).toStrictEqual({
          ...MORE_INFO,
          status: 401,
          statusText: "Unauthorized",
          message: "Invalid email, username or password",
        });
      });

      it("responds with an error if the user is already signed in but attempts to sign in again", async () => {
        const firstSignInResponse = await signIn(superadminUser);
        const sessionCookie = setCookie.parse(
          firstSignInResponse.headers["set-cookie"][0],
        )[0];

        const secondSignInResponse = await request(httpServer)
          .post(ROUTE)
          .set("cookie", `${sessionCookie.name}=${sessionCookie.value}`)
          .send({
            username: superadminUser.username,
            password: superadminUser.password,
          })
          .expect("content-type", /json/)
          .expect(401);
        expect(secondSignInResponse.body).toStrictEqual({
          ...MORE_INFO,
          status: 401,
          statusText: "Unauthorized",
          message: "Can't authenticate the request, no cookie found",
        });
      });
    });

    describe("400", () => {
      it("responds with an error if the request object is malformed", async () => {
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            uuser: superadminUser.username,
            ppass: superadminUser.password,
          })
          .expect("content-type", /json/)
          .expect(400);
        expect(response.body).toStrictEqual({
          ...MORE_INFO,
          status: 400,
          statusText: "BadRequest",
          message: "Invalid email, username or password",
        });
      });
    });

    describe("404", () => {
      it.todo(
        "responds with an error if the user account hasn't been confirmed",
      );
    });
  });

  describe(`DELETE - sign out`, () => {
    describe("204", () => {
      it("signs the user out if the user is currently signed in and ends the cookie session", async () => {
        const signInResponse = await signIn(superadminUser);
        const sessionCookie = setCookie.parse(
          signInResponse.headers["set-cookie"],
        )[0];

        const sessionKeyPattern = "sess:*";
        const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignIn.length).toBe(1);

        await request(httpServer)
          .delete(ROUTE)
          .set("Cookie", `${sessionCookie.name}=${sessionCookie.value}`)
          .expect(204);

        const sessionsAfterSignOut = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignOut.length).toBe(0);
      });
    });

    describe("401", () => {
      it.todo("responds with an error if the session cookie has expired");

      it.todo("responds with an error is the session cookie is malformed");

      it("responds with an error if the user is not signed in", async () => {
        const response = await request(httpServer)
          .delete(ROUTE)
          .send({
            username: superadminUser.username,
            password: superadminUser.password,
          })
          .expect("content-type", /json/)
          .expect(401);

        expect(response.body).toStrictEqual(RESPONSE_401);
      });

      it("responds with an error if username and password are invalid", async () => {
        const response = await request(httpServer)
          .delete(ROUTE)
          .send({ username: "invalid", password: "invalid" })
          .expect("content-type", /json/)
          .expect(401);

        expect(response.body).toStrictEqual(RESPONSE_401);
      });
    });
  });
});

describe("/sessions (for the pre-seeded user with the role Streamer)", () => {
  const broadcasterUserResponse = {
    results: {
      uuid: expect.any(String),
      userId: expect.any(Number),
      email: expect.any(String),
      username: expect.any(String),
      permissions: {
        own_audio_stream: ["create", "delete", "read", "update"],
        own_user_account: ["create", "delete", "read", "update"],
        own_broadcast: ["create", "delete", "read", "update"],
        any_broadcast: ["read"],
        own_chat_message: ["create", "delete", "read"],
      },
    },
  };

  describe("POST - sign in", () => {
    describe("200", () => {
      it("signs in with the username and password", async () => {
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: broadcasterUser.username,
            password: broadcasterUser.password,
          })
          .expect("content-type", /json/)
          .expect(200);

        expect(response.body).toStrictEqual(broadcasterUserResponse);
      });
    });
  });
});

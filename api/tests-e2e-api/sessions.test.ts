import path from "path";

import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import setCookie from "set-cookie-parser";
import { faker } from "@faker-js/faker";

import { httpServer } from "../src/http-server";
import { type RedisClient, redisConnection } from "../src/config/redis";
import {
  MORE_INFO,
  DATABASE_CONSTRAINTS,
  RESPONSE_401,
  PROFILE_IMG_PATH,
} from "../test-helpers/helpers";
import { signIn } from "../test-helpers/helpers";
import { API_URL_PREFIX } from "../src/config/env";
import { createUser } from "../test-helpers/helpers";

const ROUTE = `${API_URL_PREFIX}/sessions`;

const sessionKeyPattern = "sess:*";
const sessionCookieResponse = [
  {
    name: "sess.sid",
    httpOnly: true,
    // sameSite: "Strict" // commented out because this is set only in prod env
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
    displayName: faker.internet
      .displayName()
      .substring(0, DATABASE_CONSTRAINTS.maxDisplayName),
    isEmailConfirmed: true,
    isDeleted: false,
    profilePictureUrl: faker.system.fileName(),
    about: faker.lorem.paragraphs(),
  };

  describe("POST - sign in", () => {
    describe("200", () => {
      it("signs the user in, creating a cookie session", async () => {
        await createUser(testUser);

        const sessionsBeforeSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsBeforeSignIn.length).toBe(0);

        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: testUser.username,
            password: testUser.password,
          })
          .expect(200);

        console.log("=====================================================");
        console.log(setCookie.parse(response.headers["set-cookie"]));
        console.log("=====================================================");

        expect(setCookie.parse(response.headers["set-cookie"])).toStrictEqual(
          sessionCookieResponse,
        );

        const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignIn.length).toBe(1);
      });

      describe("signs the user in, responding with the user object", () => {
        it("if the user provides username and password", async () => {
          await createUser(testUser);
          const response = await request(httpServer)
            .post(ROUTE)
            .send({
              username: testUser.username,
              password: testUser.password,
            })
            .expect("content-type", /json/)
            .expect(200);

          expect(response.body).toStrictEqual({
            results: {
              uuid: expect.any(String),
              userId: expect.any(Number),
              username: testUser.username,
              email: testUser.email,
              displayName: testUser.displayName,
              isEmailConfirmed: testUser.isEmailConfirmed,
              profilePictureUrl: path.join(
                PROFILE_IMG_PATH,
                testUser.profilePictureUrl,
              ),
              about: testUser.about,
              createdAt: expect.any(String),
              lastLoginAt: expect.any(String),
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

        it("if the user provides email and password", async () => {
          await createUser(testUser);
          const response = await request(httpServer)
            .post(ROUTE)
            .send({
              username: testUser.username,
              password: testUser.password,
            })
            .expect("content-type", /json/)
            .expect(200);

          console.log(response.body);

          expect(response.body).toStrictEqual({
            results: {
              uuid: expect.any(String),
              userId: expect.any(Number),
              username: testUser.username,
              email: testUser.email,
              displayName: testUser.displayName,
              isEmailConfirmed: testUser.isEmailConfirmed,
              profilePictureUrl: path.join(
                PROFILE_IMG_PATH,
                testUser.profilePictureUrl,
              ),
              about: testUser.about,
              createdAt: expect.any(String),
              lastLoginAt: expect.any(String),
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

    describe("401", () => {
      it("responds with an error if credentials are invalid", async () => {
        await createUser(testUser);
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
        await createUser(testUser);
        const firstSignInResponse = await signIn({
          username: testUser.username,
          password: testUser.password,
        });
        const sessionCookie = setCookie.parse(
          firstSignInResponse.headers["set-cookie"][0],
        )[0];

        const secondSignInResponse = await request(httpServer)
          .post(ROUTE)
          .set("cookie", `${sessionCookie.name}=${sessionCookie.value}`)
          .send({
            username: testUser.username,
            password: testUser.password,
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

      it("doesn't set a cookie if credentials are invalid", async () => {
        await createUser(testUser);
        const response = await request(httpServer)
          .post(ROUTE)
          .send({ username: "invalid", password: "invalid" });

        expect(setCookie.parse(response.headers["set-cookie"]).length).toBe(0);
      });
    });

    describe("400", () => {
      it("responds with an error if the request object is malformed", async () => {
        await createUser(testUser);
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            uuser: testUser.username,
            ppass: testUser.password,
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

      it("doesn't set a cookie if the request object is malformed", async () => {
        await createUser(testUser);
        const response = await request(httpServer).post(ROUTE).send({
          uuser: testUser.username,
          ppass: testUser.password,
        });

        expect(setCookie.parse(response.headers["set-cookie"]).length).toBe(0);
      });

      it("responds with an error if the request object doesn't contain neither username nor email", async () => {
        await createUser(testUser);
        const response = await request(httpServer)
          .post(ROUTE)
          .send({})
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
      it("responds with an error if the user account has been deleted", async () => {
        await createUser({ ...testUser, isEmailConfirmed: false });
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: testUser.username,
            password: testUser.password,
          })
          .expect("content-type", /json/)
          .expect(404);
        expect(response.body).toStrictEqual({
          ...MORE_INFO,
          status: 404,
          statusText: "NotFound",
          message:
            "Pending Account. Look for the verification email in your inbox and click the link in that email",
        });
      });

      it("doesn't set a cookie if the user account has been deleted", async () => {
        await createUser({ ...testUser, isDeleted: true });
        const response = await request(httpServer)
          .post(ROUTE)
          .send({
            username: testUser.username,
            password: testUser.password,
          })
          .expect("content-type", /json/)
          .expect(401);
        expect(response.body).toStrictEqual({
          ...MORE_INFO,
          status: 401,
          statusText: "Unauthorized",
          message: "Invalid email, username or password",
        });
      });

      it("responds with an error if the user account hasn't been confirmed", async () => {
        await createUser({
          ...testUser,
          isEmailConfirmed: false,
        });

        const response = await request(httpServer)
          .post(ROUTE)
          .send({ username: testUser.username, password: testUser.password })
          .expect("content-type", /json/)
          .expect(404);
        expect(response.body).toStrictEqual({
          ...MORE_INFO,
          status: 404,
          statusText: "NotFound",
          message:
            "Pending Account. Look for the verification email in your inbox and click the link in that email",
        });
      });

      it("doesn't set a cookie if the user account hasn't been confirmed", async () => {
        await createUser({
          ...testUser,
          isEmailConfirmed: false,
        });

        const response = await request(httpServer)
          .post(ROUTE)
          .send({ username: testUser.username, password: testUser.password });

        expect(setCookie.parse(response.headers["set-cookie"]).length).toBe(0);
      });
    });
  });

  describe(`DELETE - sign out`, () => {
    describe("204", () => {
      it("signs the user out if the user is currently signed in and ends the cookie session", async () => {
        await createUser(testUser);
        const signInResponse = await signIn({
          username: testUser.username,
          password: testUser.password,
        });
        const sessionCookie = setCookie.parse(
          signInResponse.headers["set-cookie"],
        )[0];

        const sessionKeyPattern = "sess:*";
        const sessionsAfterSignIn = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignIn.length).toBe(1);

        await request(httpServer)
          .delete(ROUTE)
          .set("Cookie", `${sessionCookie.name}=${sessionCookie.value}`)
          .expect(204)
          .catch(console.error);

        const sessionsAfterSignOut = await redisClient.keys(sessionKeyPattern);
        expect(sessionsAfterSignOut.length).toBe(0);
      });
    });

    describe("401", () => {
      it.todo("responds with an error if the session cookie has expired");

      it.todo("responds with an error is the session cookie is malformed");

      it("responds with an error if the user is not signed in", async () => {
        await createUser(testUser);
        const response = await request(httpServer)
          .delete(ROUTE)
          .send({
            username: testUser.username,
            password: testUser.password,
          })
          .expect("content-type", /json/)
          .expect(401);

        expect(response.body).toStrictEqual(RESPONSE_401);
      });

      it("responds with an error if username and password are invalid", async () => {
        await createUser(testUser);
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

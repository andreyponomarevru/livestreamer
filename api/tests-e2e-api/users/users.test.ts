import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../../src/http-server";
import { dbConnection } from "../../src/config/postgres";
import { createUser, DATABASE_CONSTRAINTS } from "../../test-helpers/helpers";
import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/users`;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  const username = faker.internet
    .username()
    .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength);
  const password = faker.internet
    .password()
    .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength);
  const email = faker.internet.email();
  const profilePictureUrl = faker.system.filePath();
  const displayName = faker.internet
    .displayName()
    .substring(0, DATABASE_CONSTRAINTS.maxDisplayName);

  describe("POST - create a new user account", () => {
    describe("202", () => {
      it("accepts the request for processing, responding with an empty body", async () => {
        await request(httpServer)
          .post(ROUTE)
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email })
          .expect(202);
      });

      it("saves a new user in database, marking his email as unconfirmed", async () => {
        await request(httpServer)
          .post(ROUTE)
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email });

        const pool = await dbConnection.open();
        const dbResponse = await pool.query(
          `SELECT * FROM appuser WHERE username = '${username}'`,
        );
        expect(dbResponse.rows).toStrictEqual([
          {
            appuser_id: expect.any(Number),
            username,
            email,
            role_id: 2,
            created_at: expect.any(Date),
            password_hash: expect.any(String),
            last_login_at: null,
            is_deleted: false,
            is_email_confirmed: false,
            email_confirmation_token: expect.any(String),
            password_reset_token: null,
            about: "",
            display_name: username,
            profile_picture_url: expect.any(String),
            subscription_name: expect.any(String),
            website_url: "",
          },
        ]);
      });
    });

    describe("400", () => {
      it("responds with an error if the username and password are not provided in the 'Authorization' header, using the 'Basic' schema", async () => {
        await request(httpServer)
          .post(ROUTE)
          .set("authorization", "Basic ")
          .send({ email })
          .expect(400);
      });
    });

    describe("409", () => {
      it("responds with an error if the user with this username or email already exists", async () => {
        await createUser({
          username,
          password,
          email,
          roleId: 2,
          isDeleted: false,
          isEmailConfirmed: false,
          displayName,
          profilePictureUrl,
        });

        await request(httpServer)
          .post(ROUTE)
          .set("authorization", `Basic ${btoa(`${username}:${password}`)}`)
          .send({ email })
          .expect(409);
      });
    });
  });
});

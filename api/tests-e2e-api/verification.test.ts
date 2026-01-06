import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../src/http-server";
import { dbConnection } from "../src/config/postgres";
import {
  createUser,
  DATABASE_CONSTRAINTS,
  MORE_INFO,
  RESPONSE_401,
} from "../test-helpers/helpers";
import { API_URL_PREFIX } from "../src/config/env";

const ROUTE = "/verification";

const unconfirmedUser = {
  roleId: 2,
  username: faker.internet
    .username()
    .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength),
  email: faker.internet.email(),
  password: faker.internet.password({
    length: DATABASE_CONSTRAINTS.maxPasswordLength,
  }),
  emailConfirmationToken: faker.string.uuid(),
  displayName: faker.internet
    .displayName()
    .substring(0, DATABASE_CONSTRAINTS.maxDisplayName),
  profilePictureUrl: faker.system.filePath(),
  about: faker.lorem.paragraphs(),
  subscriptionName: faker.string
    .alpha()
    .substring(0, DATABASE_CONSTRAINTS.maxSubscriptionPlanLength),
  websiteUrl: faker.internet.url(),
  isEmailConfirmed: false,
  isDeleted: false,
};

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  describe(`POST  - verify user sign up`, () => {
    describe("204", () => {
      it("confirms the user sign up if the email confirmation token from email link is valid and attached to the request in the query string", async () => {
        await createUser(unconfirmedUser);

        await request(httpServer)
          .post(
            `${API_URL_PREFIX}/verification?token=${unconfirmedUser.emailConfirmationToken}`,
          )
          .expect(204)
          .catch((err) => {
            console.error(err);
            throw err;
          });

        const pool = await dbConnection.open();
        const confirmedUser = await pool.query(
          `SELECT * FROM appuser WHERE username = '${unconfirmedUser.username}'`,
        );

        expect(confirmedUser.rows.length).toBe(1);
        expect(confirmedUser.rows[0]).toEqual(
          expect.objectContaining({
            appuser_id: expect.any(Number),
            username: unconfirmedUser.username,
            email: unconfirmedUser.email,
            last_login_at: null,
            is_deleted: false,
            is_email_confirmed: true,
            email_confirmation_token: null,
            password_reset_token: null,
          }),
        );
      });

      it.todo("responds with success if the user has been deleted");

      it.todo("responds with success if the user email doesn't exist in db");
    });

    describe("400", () => {
      it("responds with an error if the request path doesn't contain the token from the email link", async () => {
        await createUser(unconfirmedUser);

        const response = await request(httpServer)
          .post(`${API_URL_PREFIX}/verification`)
          .expect(400)
          .expect("content-type", /json/);

        expect(response.body).toStrictEqual({
          status: 400,
          statusText: "BadRequest",
          message: "Token value is required",
          ...MORE_INFO,
        });
      });
    });

    describe("401", () => {
      it("responds with an error if the token from the email link doesn't match any token in db", async () => {
        await createUser(unconfirmedUser);

        const response = await request(httpServer)
          .post(`${API_URL_PREFIX}/verification?token=invalid-token`)
          .expect(401)
          .expect("content-type", /json/);

        expect(response.body).toStrictEqual({
          ...RESPONSE_401,
          message: "Confirmation token is invalid",
        });
      });
    });
  });
});

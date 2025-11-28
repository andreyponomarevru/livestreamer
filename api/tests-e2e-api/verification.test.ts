import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../src/http-server";
import { dbConnection } from "../src/config/postgres";
import {
  DATABASE_CONSTRAINTS,
  MORE_INFO,
  REQUEST_VALIDATION_RULES,
  RESPONSE_401,
} from "../test-helpers/helpers";
import { API_URL_PREFIX } from "../src/config/env";

const ROUTE = "/verification";

const unconfirmedUser = {
  roleId: 2,
  username: faker.internet
    .username()
    .substring(0, REQUEST_VALIDATION_RULES.maxUsernameLength),
  email: faker.internet.email(),
  passwordHash: faker.internet
    .password()
    .substring(0, REQUEST_VALIDATION_RULES.maxPasswordLength),
  emailConfirmationToken: faker.string.uuid(),
  displayName: faker.internet
    .displayName()
    .substring(0, REQUEST_VALIDATION_RULES.maxDisplayName),
  profilePictureUrl: faker.system.filePath(),
  about: faker.lorem.paragraphs(),
  subscriptionName: faker.string
    .alpha()
    .substring(0, DATABASE_CONSTRAINTS.maxSubscriptionPlanLength),
  websiteUrl: faker.internet.url(),
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
    async function seedUser(user: typeof unconfirmedUser) {
      const pool = await dbConnection.open();
      await pool.query(`
        INSERT INTO appuser (
          role_id,
          username, 
          email, 
          password_hash, 
          email_confirmation_token,
          display_name,
          profile_picture_url,
          about,
          subscription_name,
          website_url
        ) 
        VALUES (
          ${user.roleId},
          '${user.username}', 
          '${user.email}', 
          '${user.passwordHash}', 
          '${user.emailConfirmationToken}',
          '${user.displayName}',
          '${user.profilePictureUrl}',
          '${user.about}', 
          '${user.subscriptionName}',
          '${user.websiteUrl}'
        )`);
    }

    describe("204", () => {
      it("confirms the user sign up if the email confirmation token from email link is valid and attached to the request in the query string", async () => {
        await seedUser(unconfirmedUser);

        await request(httpServer)
          .post(
            `${API_URL_PREFIX}/verification?token=${unconfirmedUser.emailConfirmationToken}`,
          )
          .expect(204);

        const pool = await dbConnection.open();
        const confirmedUser = await pool.query(
          `SELECT * FROM appuser WHERE username = '${unconfirmedUser.username}'`,
        );

        expect(confirmedUser.rows).toStrictEqual([
          {
            appuser_id: expect.any(Number),
            role_id: 2,
            username: unconfirmedUser.username,
            password_hash: unconfirmedUser.passwordHash,
            email: unconfirmedUser.email,
            created_at: expect.any(Date),
            last_login_at: null,
            is_deleted: false,
            is_email_confirmed: true,
            email_confirmation_token: null,
            password_reset_token: null,
            display_name: unconfirmedUser.displayName,
            about: unconfirmedUser.about,
            profile_picture_url: unconfirmedUser.profilePictureUrl,
            subscription_name: unconfirmedUser.subscriptionName,
            website_url: unconfirmedUser.websiteUrl,
          },
        ]);
      });
    });

    describe("400", () => {
      it("responds with an error if the request path doesn't contain the token from the email link", async () => {
        await seedUser(unconfirmedUser);

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
        await seedUser(unconfirmedUser);

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

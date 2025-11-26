import { describe, it, expect } from "@jest/globals";
import request from "supertest";

import { httpServer } from "../src/http-server";
import { dbConnection } from "../src/config/postgres";
import { MORE_INFO, RESPONSE_401 } from "../test-helpers/helpers";
import { API_URL_PREFIX } from "../src/config/env";

const unconfirmedUser = {
  roleId: 2,
  username: "ivanivanovich",
  email: "ivan@ivanovich.ru",
  passwordHash: "pass-hash",
  emailConfirmationToken: "123456789",
  displayName: "ivanivanovich",
  profilePictureUrl: "/mnt/home/ava.jpg",
};

describe("/verification", () => {
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
          profile_picture_url
        ) 
        VALUES (
          ${user.roleId},
          '${user.username}', 
          '${user.email}', 
          '${user.passwordHash}', 
          '${user.emailConfirmationToken}',
          '${user.displayName}',
          '${user.profilePictureUrl}'
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
            username: "ivanivanovich",
            password_hash: "pass-hash",
            email: "ivan@ivanovich.ru",
            created_at: expect.any(Date),
            last_login_at: null,
            is_deleted: false,
            is_email_confirmed: true,
            email_confirmation_token: null,
            password_reset_token: null,
            display_name: "ivanivanovich",
            about: "",
            profile_picture_url: "/mnt/home/ava.jpg",
            subscription_name: "",
            website_url: "",
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

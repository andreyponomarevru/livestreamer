import { describe, it, beforeAll, afterAll, expect } from "@jest/globals";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { httpServer } from "../../../src/http-server";
import { API_URL_PREFIX } from "../../../src/config/env";
import {
  createUser,
  DATABASE_CONSTRAINTS,
} from "../../../test-helpers/helpers";
import { dbConnection } from "../../../src/config/postgres";

const ROUTE = `${API_URL_PREFIX}/users/me/settings/password`;

beforeAll(async () => {
  httpServer.listen();
});

afterAll(async () => {
  httpServer.close(async (err) => {
    if (err) throw err;
  });
});

describe(ROUTE, () => {
  describe(`PATCH - update the pasword`, () => {
    describe("if the user attempts to reset password (submits only req.body.email)", () => {
      describe("202", () => {
        describe("if the user email is already confirmed and his account is not marked as deleted", () => {
          it("responds with an empty body", async () => {
            const username = faker.internet
              .username()
              .substring(0, DATABASE_CONSTRAINTS.maxUsernameLength);
            const password = faker.internet
              .password()
              .substring(0, DATABASE_CONSTRAINTS.maxPasswordLength);
            const email = faker.internet.email();
            await createUser({
              roleId: 2,
              username,
              password,
              email,
              isDeleted: false,
              isEmailConfirmed: true,
            });
            const agent = request.agent(httpServer);
            await agent
              .post(`${API_URL_PREFIX}/sessions`)
              .send({ username, password })
              .expect(200);

            const pool = await dbConnection.open();
            const res1 = await pool.query(
              `SELECT appuser_id, password_reset_token FROM appuser WHERE username = $1`,
              [username],
            );
            expect(res1.rows).toHaveLength(1);
            expect(typeof res1.rows[0].appuser_id).toBe("number");
            expect(res1.rows[0].password_reset_token).toBeNull();

            await agent.patch(ROUTE).send({ email }).expect(202);

            const res2 = await pool.query(
              `SELECT password_reset_token FROM appuser WHERE username = $1`,
              [username],
            );
            expect(res2.rows).toHaveLength(1);
            expect(typeof res2.rows[0].password_reset_token).toBe("string");
            expect(res2.rows[0].password_reset_token.length > 0).toBe(true);
          });

          // Checking whether the nodemailer function has been triggered will be enough
          it.todo(
            "sends the link with a password reset token (aka password update tooken) to the user's email",
          );
        });

        describe("responds with an empty body and does nothing", () => {
          it.todo("if the user email is uncomfirmed");
          it.todo("if the user email does not exist");
          it.todo("if the user email is marked as delete");
        });
      });

      describe("400", () => {
        it.todo(
          "responds with an error if the body doesn't contain the user email used during the sign up",
        );
        it.todo(
          "responds with an error if the email provided in the body has not been confirmed",
        );
      });
    });

    describe("if the request is to save the new password (the user sends the request containing the previously provided password reset token - the one he got on email - (req.body.token) + a new password (req.body.newPassword))", () => {
      describe("204", () => {
        it.todo(
          "responds with an empty body if a new password has been saved  successfuly",
        );
      });

      describe("400", () => {
        it.todo(
          "responds with an error if the body doesn't contain both the previously obtained password reset token and a new password",
        );
      });

      describe("401", () => {
        it.todo(
          "responds with an error if the user supplies an invalid password reset token",
        );
        it.todo(
          "responds with an error if the user doesn't send the password reset token",
        );
      });
    });
  });
});

import { describe, it } from "@jest/globals";
import request from "supertest";
import { httpServer } from "../../src/http-server";
import { superadminUser } from "../../test-helpers/jest-hooks/utils/user";
import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/users/me/settings/password`;

describe(ROUTE, () => {
  describe(`PATCH - update the pasword`, () => {
    describe("202", () => {
      it.skip("responds with an empty body", async () => {
        await request(httpServer).patch(ROUTE).send({
          email: superadminUser.email,
        });
      });

      it.todo(
        "responds with an empty body and sends the link with a password reset token (aka password update tooken) to the user's email if the user sends the request containing only email, while his email is already confirmed and account is not marked as deleted",
      );

      it.todo(
        "responds with an empty body and saves the new password if the user sends the request containing the previously provided password reset token (the one he got on email) + a new password",
      );
    });

    describe("responds with an empty body and does nothing", () => {
      it.todo("if the user email is uncomfirmed");
      it.todo("if the user email does not exist");
      it.todo("if the user email is marked as delete");
    });

    describe("204", () => {
      it.todo(
        "responds with an empty body if a new password has been saved  successfuly",
      );
    });

    describe("400", () => {
      describe("if the request is to get the new password reset token", () => {
        it.todo(
          "responds with an error if the body doesn't contain the user email used during the sign up",
        );
        it.todo(
          "responds with an error if the email provided in the body has not been confirmed",
        );
      });

      describe("if the request is to save the new password", () => {
        it.todo(
          "responds with an error if the body doesn't contain both the previously obtained password reset token and a new password",
        );
      });
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

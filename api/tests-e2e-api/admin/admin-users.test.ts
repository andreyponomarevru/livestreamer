import { describe, it, expect } from "@jest/globals";
import request from "supertest";

import { httpServer } from "../../src/http-server";
import {
  superadminUser,
  broadcasterUser,
} from "../../test-helpers/jest-hooks/utils/user";
import { RESPONSE_403 } from "../../test-helpers/helpers";
import { API_URL_PREFIX } from "../../src/config/env";

const ROUTE = `${API_URL_PREFIX}/admin/users`;

describe(ROUTE, () => {
  describe("GET - get all app users", () => {
    describe("200", () => {
      it("responds with an array of all users (not paginated) if the user role is 'superadmin'", async () => {
        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username: superadminUser.username,
          password: superadminUser.password,
        });

        const user = {
          uuid: expect.any(String),
          userId: expect.any(Number),
          email: expect.any(String),
          username: expect.any(String),
          password: expect.any(String),
          createdAt: expect.any(String),
          isEmailConfirmed: true,
          isDeleted: false,
        };
        const expected = { results: [user, user] };

        const response = await agent.get(ROUTE);

        expect(response.body).toMatchObject(expected);
      });

      it.todo(
        "responds with the sanitized user objects (they don't contain any sensitive data) if the user role is 'superadmin'",
      );
    });

    describe("401", () => {
      it.todo("responds with an error if the user is not authenticated");
    });

    describe("403", () => {
      it("responds with an error if the user role is not 'superadmin'", async () => {
        const agent = request.agent(httpServer);
        await agent.post(`${API_URL_PREFIX}/sessions`).send({
          username: broadcasterUser.username,
          password: broadcasterUser.password,
        });

        const response = await agent
          .get(ROUTE)
          .expect(403)
          .expect("content-type", /json/);

        expect(response.body).toStrictEqual(RESPONSE_403);
      });
    });
  });
});

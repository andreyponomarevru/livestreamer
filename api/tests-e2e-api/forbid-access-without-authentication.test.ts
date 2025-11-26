import { describe, it, expect } from "@jest/globals";
import request from "supertest";

import { httpServer } from "../src/http-server";
import { RESPONSE_401 } from "../test-helpers/helpers";
import { API_URL_PREFIX } from "../src/config/env";
import { superadminUser } from "../test-helpers/jest-hooks/utils/user";

const ROUTES = {
  GET: ["/users/me", "/users/me/broadcasts", "/admin/users"].map(
    (i) => `${API_URL_PREFIX}${i}`,
  ),
  POST: [
    "/broadcasts/1/messages",
    "/broadcasts/1/messages/1/likes",
    "/users/me/broadcasts",
  ].map((i) => `${API_URL_PREFIX}${i}`),

  PUT: ["/broadcasts/1/stream/likes", "/users/me/broadcasts/1/stream"].map(
    (i) => `${API_URL_PREFIX}${i}`,
  ),
  PATCH: ["/users/me", "/users/me/broadcasts/1"].map(
    (i) => `${API_URL_PREFIX}${i}`,
  ),

  DELETE: [
    "/admin/broadcasts/1/messages/1",
    "/broadcasts/1/messages/1",
    "/broadcasts/1/messages/1/likes",
    "/users/me",
    "/users/me/broadcasts/1",
    "/sessions",
  ].map((i) => `${API_URL_PREFIX}${i}`),
};

const superadminCredentials = {
  username: superadminUser.username,
  password: superadminUser.password,
};

describe("responds with a 401 error if the user is not authenticated", () => {
  it.each(ROUTES.GET)("GET %p", async (route: string) => {
    const response = await request(httpServer)
      .get(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.POST)("POST %p", async (route: string) => {
    const response = await request(httpServer)
      .post(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.PUT)("PUT %p", async (route: string) => {
    const response = await request(httpServer)
      .put(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.DELETE)("DELETE %p", async (route: string) => {
    const response = await request(httpServer)
      .delete(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.PATCH)("PATCH %p", async (route: string) => {
    const response = await request(httpServer)
      .patch(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });
});

describe("responds with a 401 if the header doesn't contain the session cookie", () => {
  it.each(ROUTES.GET)("GET %p", async (route: string) => {
    await request(httpServer)
      .post(`${API_URL_PREFIX}/sessions`)
      .set("accept", "application/json")
      .send(superadminCredentials)
      .expect(200);

    const response = await request(httpServer)
      .get(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.POST)("POST %p", async (route: string) => {
    await request(httpServer)
      .post(`${API_URL_PREFIX}/sessions`)
      .set("accept", "application/json")
      .send(superadminCredentials)
      .expect(200);

    const response = await request(httpServer)
      .post(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.PUT)("PUT %p", async (route: string) => {
    await request(httpServer)
      .post(`${API_URL_PREFIX}/sessions`)
      .set("accept", "application/json")
      .send(superadminCredentials)
      .expect(200);

    const response = await request(httpServer)
      .put(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.DELETE)("DELETE %p", async (route: string) => {
    await request(httpServer)
      .post(`${API_URL_PREFIX}/sessions`)
      .set("accept", "application/json")
      .send(superadminCredentials)
      .expect(200);

    const response = await request(httpServer)
      .delete(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });

  it.each(ROUTES.PATCH)("PATCH %p", async (route: string) => {
    await request(httpServer)
      .post(`${API_URL_PREFIX}/sessions`)
      .set("accept", "application/json")
      .send(superadminCredentials)
      .expect(200);

    const response = await request(httpServer)
      .patch(route)
      .expect(401)
      .expect("content-type", /json/);

    expect(response.body).toStrictEqual(RESPONSE_401);
  });
});

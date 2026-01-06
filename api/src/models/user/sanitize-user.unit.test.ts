import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import { User } from "./user";
import { sanitizeUser } from "./sanitize-user";
import { type Permissions } from "../../types";

describe("sanitizeUser function", () => {
  const uuid = randomUUID();
  const userId = faker.number.int();
  const email = faker.internet.exampleEmail();
  const username = faker.internet.username();
  const password = faker.internet.password();
  const displayName = username;
  const createdAt = faker.date.past().toISOString();
  const isEmailConfirmed = faker.datatype.boolean();
  const isDeleted = faker.datatype.boolean();
  const permissions = { broadcast: [faker.string.sample()] } as Permissions;

  const user: User = {
    displayName,
    uuid,
    userId,
    email,
    username,
    password,
    createdAt,
    isEmailConfirmed,
    isDeleted,
    permissions,
  };

  it("returns user with sensitive data stripped out", () => {
    expect(sanitizeUser(user)).toStrictEqual({
      uuid,
      userId,
      email,
      username,
      permissions,
    });
  });
});

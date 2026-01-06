import { describe, it, expect } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import { User } from "./user";
import { type Permissions } from "../../types";
import { DATABASE_CONSTRAINTS } from "../../../test-helpers/helpers";

describe("User class", () => {
  const uuid = randomUUID();
  const userId = faker.number.int();
  const email = faker.internet.exampleEmail();
  const username = faker.internet.username();
  const password = faker.internet.password({
    length: DATABASE_CONSTRAINTS.maxPasswordLength,
  });
  const displayName = username;
  const createdAt = faker.date.past().toISOString();
  const isEmailConfirmed = faker.datatype.boolean();
  const isDeleted = faker.datatype.boolean();
  const permissions = { broadcast: [faker.string.sample()] } as Permissions;
  const lastLoginAt = faker.date.past().toISOString();

  it("returns a new user instance", () => {
    const user: User = {
      uuid,
      userId,
      email,
      username,
      password,
      displayName,
      createdAt,
      isEmailConfirmed,
      isDeleted,
      permissions,
    };
    const user = new User(user);

    expect(user.uuid).toBe(user.uuid);
    expect(user.userId).toBe(user.userId);
    expect(user.email).toBe(user.email);
    expect(user.username).toBe(user.username);
    expect(user.password).toBe(user.password);
    expect(user.createdAt).toBe(user.createdAt);
    expect(user.isEmailConfirmed).toBe(user.isEmailConfirmed);
    expect(user.isDeleted).toBe(user.isDeleted);
    expect(user.permissions).toStrictEqual(user.permissions);
  });

  it("sets the last login date if it is provided", () => {
    const USER: User = {
      uuid,
      userId,
      email,
      username,
      password,
      displayName,
      createdAt,
      isEmailConfirmed,
      isDeleted,
      permissions,
      lastLoginAt,
    };
    const user = new User(USER);

    expect({ ...user }).toStrictEqual({ ...USER });
  });

  it("doesn't set the last login date if it is not provided", () => {
    const USER: User = {
      uuid,
      userId,
      email,
      username,
      password,
      displayName,
      createdAt,
      isEmailConfirmed,
      isDeleted,
      permissions,
    };
    const user = new User(USER);

    expect(user.lastLoginAt).toBe(undefined);
  });
});

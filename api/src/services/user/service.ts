import { randomUUID } from "crypto";

import { Permissions } from "../../types";
import { User } from "../../models/user/user";
import { authnService } from "../authn";
import { mailService } from "../mail";
import { userRepo } from "../../models/user/queries";
import { EXCHANGE_NAME, QUEUES } from "../../config/rabbitmq/config";
import { rabbitMQPublisher } from "../../config/rabbitmq/publisher";

export const userService = {
  createUser: async function ({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }): Promise<void> {
    const userToken = authnService.generateToken();

    const { userId } = await userRepo.createUser({
      username: username,
      email: email,
      password: await authnService.hashPassword(password),
      roleId: 2,
      emailConfirmationToken: userToken,
      isEmailConfirmed: false,
      displayName: username,
      profilePictureUrl: "/mnt/default-avatar.jpg",
      subscriptionName: "basic",
      about: "",
      websiteUrl: "",
    });

    await rabbitMQPublisher.sendMsgToQueue({
      queue: QUEUES.confirmSignUpEmail.queue,
      exchange: EXCHANGE_NAME,
      routingKey: QUEUES.confirmSignUpEmail.routingKey,
      content: Buffer.from(
        JSON.stringify(
          mailService.emailTemplates.createSignUpConfirmationEmail({
            username: username,
            email: email,
            userId: userId,
            userToken: userToken,
          }),
        ),
      ),
    });
  },

  readUser: async function ({
    userId,
    username,
    email,
  }: {
    userId?: number;
    username?: string;
    email?: string;
  }): Promise<User | null> {
    const user = await userRepo.readUser({ userId, username, email });
    if (!user) return null;

    const permissions = await userRepo.readUserPermissions(user.userId);

    return { uuid: randomUUID(), ...user, permissions };
  },

  readAllUsers: async function (): Promise<User[]> {
    const users = await userRepo.readAllUsers();
    return users.map((user) => ({ uuid: randomUUID(), ...user }));
  },

  updateUser: async function ({
    userId,
    username,
  }: {
    userId: number;
    username: string;
  }): Promise<{
    uuid: string;
    userId: number;
    email: string;
    username: string;
    permissions: Permissions;
  }> {
    const user = await userRepo.updateUser({ userId, username });
    return { uuid: randomUUID(), ...user };
  },

  destroyUser: async function (userId: number): Promise<void> {
    await userRepo.destroyUser(userId);
  },

  isUserExists: async function ({
    userId,
    username,
    email,
  }: {
    userId?: number;
    username?: string;
    email?: string;
  }): Promise<boolean> {
    return await userRepo.isUserExists({ userId, username, email });
  },

  isUserDeleted: async function ({
    userId,
    email,
  }: {
    userId?: number;
    email?: string;
  }): Promise<boolean> {
    return await userRepo.isUserDeleted({ userId, email });
  },

  updatePassword: async function ({
    userId,
    newPassword,
  }: {
    userId: number;
    newPassword: string;
  }): Promise<void> {
    const hash = await authnService.hashPassword(newPassword);
    await userRepo.updatePassword({ userId, newPassword: hash });
  },

  updateLastLoginTime: async function (userId: number): Promise<{
    lastLoginAt: string;
  }> {
    return await userRepo.updateLastLoginTime(userId);
  },

  isEmailConfirmed: async function ({
    userId,
    email,
  }: {
    userId?: number;
    email?: string;
  }): Promise<boolean> {
    return await userRepo.isEmailConfirmed({ userId, email });
  },

  findByEmailConfirmationToken: async function (token: string): Promise<{
    userId: number | null;
  }> {
    return await userRepo.findByEmailConfirmationToken(token);
  },

  findByPasswordResetToken: async function (token: string): Promise<{
    userId: number | null;
  }> {
    return await userRepo.findByPasswordResetToken(token);
  },
};

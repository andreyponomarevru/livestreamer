import crypto from "crypto";

import bcrypt from "bcrypt";

import { userRepo } from "../../models/user/queries";
import { logger } from "../../config/logger";
import { mailService } from "../mail";
import { rabbitMQPublisher } from "../../config/rabbitmq/publisher";
import { EXCHANGE_NAME, QUEUES } from "../../config/rabbitmq/config";

export const authnService = {
  confirmEmail: async function (userId: number): Promise<void> {
    const { username, email } = await userRepo.updateIsEmailConfirmed(
      userId,
      true,
    );

    await rabbitMQPublisher.sendMsgToQueue({
      queue: QUEUES.welcomeEmail.queue,
      exchange: EXCHANGE_NAME,
      routingKey: QUEUES.welcomeEmail.routingKey,
      content: Buffer.from(
        JSON.stringify(
          mailService.emailTemplates.createWelcomeEmail({ username, email }),
        ),
      ),
    });
  },

  handlePasswordReset: async function (email: string): Promise<void> {
    const token = this.generateToken();

    await userRepo.savePasswordResetToken({ email, token });

    const passResetEmail = mailService.emailTemplates.createPasswordResetEmail({
      email,
      token,
    });

    await rabbitMQPublisher.sendMsgToQueue({
      queue: QUEUES.resetPasswordEmail.queue,
      exchange: EXCHANGE_NAME,
      routingKey: QUEUES.resetPasswordEmail.routingKey,
      content: Buffer.from(JSON.stringify(passResetEmail)),
    });
  },

  hashPassword: async function (
    password: string,
    saltRounds = 10,
  ): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  },

  isPasswordMatch: async function (
    password: string,
    hash: string,
  ): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      logger.error(`${__filename}: ${err}`);
      return false;
    }
  },

  generateToken: function (size = 64): string {
    return crypto.randomBytes(size).toString("hex");
  },
};

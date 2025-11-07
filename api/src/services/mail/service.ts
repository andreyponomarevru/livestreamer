import { type ConsumeMessage } from "amqplib";
import nodemailer, { SendMailOptions } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";
import { mailConfig } from "../../config/mail";
import { logger } from "../../config/logger";
import {
  MAIL_FROM_EMAIL,
  EMAIL_CONFIRMATION_LINK,
  SIGN_IN_LINK,
  SUBMIT_NEW_PASSWORD_LINK,
} from "../../config/env";
import { messageQueueEmitter } from "../../config/rabbitmq/consumer";
import { QUEUES } from "../../config/rabbitmq/config";

type MailConfirmationEmail = {
  username: string;
  email: string;
  userId: number;
  userToken: string;
};

type WelcomeEmail = {
  username: string;
  email: string;
};

type ResetPasswordTokenEMail = {
  email: string;
  token: string;
};

export const mailService = {
  sendEmail: async function (
    rabbitMQMessage: ConsumeMessage | null,
  ): Promise<SMTPTransport.SentMessageInfo | void> {
    logger.debug(rabbitMQMessage);

    if (rabbitMQMessage === null) {
      throw new Error("'mailOptions' is null");
    }

    try {
      const mail: SendMailOptions = JSON.parse(String(rabbitMQMessage));
      const transporter = nodemailer.createTransport(mailConfig);
      transporter.verify((err) => {
        if (err) throw err;
      });
      const info = await transporter.sendMail(mail);
      logger.debug("[Mail Service] Sent message ID: ", info.messageId);
      return info;
    } catch (err) {
      logger.error("[Mail Service] Email is not sent: " + err);
    }
  },

  emailTemplates: {
    createSignUpConfirmationEmail: function ({
      username,
      email,
      userToken,
    }: MailConfirmationEmail): Mail.Options {
      const emailConfirmationlink = `${EMAIL_CONFIRMATION_LINK}?token=${userToken}`;

      const options: SendMailOptions = {
        from: MAIL_FROM_EMAIL,
        to: email,
        subject: "Confirm your email",
        html: `<h1>Confirm your email</h1>
        <p>Hi ${username}.</p>
				<p>
					Thanks for registering. Please confirm your email by clicking <a href="${emailConfirmationlink}">here</a>.
        </p>`,
        replyTo: MAIL_FROM_EMAIL,
      };

      return options;
    },

    createWelcomeEmail: function ({
      username,
      email,
    }: WelcomeEmail): Mail.Options {
      const options: SendMailOptions = {
        from: MAIL_FROM_EMAIL,
        to: email,
        subject: "Email address confirmed",
        html: `<p>Thanks ${username}, email address confirmed. You're now registered and can <a href="${SIGN_IN_LINK}"">log into your account.</a></p>`,
        replyTo: MAIL_FROM_EMAIL,
      };

      return options;
    },

    createPasswordResetEmail: function ({
      email,
      token,
    }: ResetPasswordTokenEMail): Mail.Options {
      const submitNewPassReactAppLink = `${SUBMIT_NEW_PASSWORD_LINK}?token=${token}`;

      const options: SendMailOptions = {
        from: MAIL_FROM_EMAIL,
        to: email,
        subject: "Reset Password",
        html: `<p>To reset your password, click <a href="${submitNewPassReactAppLink}">here</a>.</p>`,
        replyTo: MAIL_FROM_EMAIL,
      };

      return options;
    },
  },
};

messageQueueEmitter.on(QUEUES.confirmSignUpEmail.queue, mailService.sendEmail);
messageQueueEmitter.on(QUEUES.welcomeEmail.queue, mailService.sendEmail);
messageQueueEmitter.on(QUEUES.resetPasswordEmail.queue, mailService.sendEmail);

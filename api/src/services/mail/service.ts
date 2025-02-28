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

// (Then, implement another service that consumes messages from the queue, which would actually send the confirmation email, handling retries and failures. It’s easy to imagine extending this email service to send other types of emails, neatly isolating this functionality in the application.)

// Somewhere here I should pool for RabbitMQ's new messages, and when the message arrives, consume it and send the letter with: this line:
// await mailService.sendEmail(singUpConfirmationEmail);

export const mailService = {
  sendEmail: async function (
    mailOptions: SendMailOptions,
  ): Promise<SMTPTransport.SentMessageInfo> {
    logger.debug(mailOptions);

    const transporter = nodemailer.createTransport(mailConfig);

    transporter.verify((err) => {
      if (err) throw err;
    });

    const info = await transporter.sendMail(mailOptions);

    logger.debug("Message sent: ", info.messageId);

    return info;
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
      // Link to react app, not to the API
      const submitNewPasswordLink = `${SUBMIT_NEW_PASSWORD_LINK}?token=${token}`;

      const options: SendMailOptions = {
        from: MAIL_FROM_EMAIL,
        to: email,
        subject: "Reset Password",
        html: `<p>To reset your password, click <a href="${submitNewPasswordLink}">here</a>.</p>`,
        replyTo: MAIL_FROM_EMAIL,
      };

      return options;
    },
  },
};

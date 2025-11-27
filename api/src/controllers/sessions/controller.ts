import util from "util";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import { authnService } from "../../services/authn";
import { userService } from "../../services/user";
import { HttpError } from "../../utils/http-error";
import { logger } from "../../config/logger";
import { SanitizedUser } from "../../types";
import { sanitizeUser } from "../../models/user/sanitize-user";
import { COOKIE_NAME } from "../../config/env";
import { wsService } from "../../services/ws";
import { WSClient } from "../../types";

export const sessionController = {
  createSession: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        username: string;
        email: string;
        password: string;
      }
    >,
    res: Response<{ results: SanitizedUser }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.cookies && req.session.authenticatedUser) {
        throw new HttpError({
          code: 401,
          message: "Can't authenticate the request, no cookie found",
        });
      }

      if (req.body.username && req.body.email) {
        throw new HttpError({
          code: 400,
          message: "Specify either email OR username",
        });
      }

      if (req.session.authenticatedUser) {
        logger.debug(
          `${__filename} [createSession] User is already authenticated `,
        );
        res
          .status(200)
          .json({ results: sanitizeUser(req.session.authenticatedUser) });

        return;
      }

      const user = await userService.findByUsernameOrEmail({
        email: req.body.email,
        username: req.body.username,
      });

      if (!user) {
        throw new HttpError({
          code: 401,
          message: "Invalid email, username or password",
        });
      }

      if (!user.isEmailConfirmed) {
        throw new HttpError({
          code: 404,
          message:
            "Pending Account. Look for the verification email in your inbox and click the link in that email",
        });
      }

      if (user.isDeleted) {
        logger.error(
          `${__filename} [createSession] Deleted user ${user.username} tries to sign in`,
        );
        throw new HttpError({
          code: 401,
          message: "Invalid email, username or password",
        });
      }

      if (
        await authnService.isPasswordMatch(req.body.password, user.password)
      ) {
        // We need to save uuid in session to be able to use it later when client ends the session by signing out: using this uuid we find the closed socket in WSClientStore and remove this socket. This is the only purpose of storing uuid in user object/in session.
        // TODO: move lastLoginTime update to Model level, call 'updateLastLoginTime' from 'readUser' or something like that
        const { lastLoginAt } = await userService.updateLastLoginTime(
          user.userId,
        );
        user.lastLoginAt = lastLoginAt;
        user.uuid = randomUUID();
        req.session.authenticatedUser = user;
        logger.debug(
          `${__filename} [createSession] User ${user.username} is authenticated and saved in session`,
        );
        logger.debug(`${__filename} [createSession] ${util.inspect(user)}`);

        res.status(200).json({ results: sanitizeUser(user) });
      } else {
        throw new HttpError({
          code: 401,
          message: "Invalid email, username or password",
        });
      }
    } catch (err) {
      next(err);
    }
  },

  destroySession: async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      let wsClient: WSClient | undefined;

      if (
        req.session &&
        req.session.authenticatedUser &&
        req.session.authenticatedUser.uuid
      ) {
        wsClient = wsService.clientStore.getClient(
          req.session.authenticatedUser.uuid,
        );
      }

      logger.debug(
        `${__filename} [destroySession] Authenticated user is signing out: `,
        req.session.authenticatedUser,
      );
      logger.debug(
        `${__filename} [destroySession] clients in store: ${util.inspect(
          wsService.clientStore.clients,
        )}`,
      );

      // Handle situation when the client has signed in, but hadn't connected over WS (for example, when the client is 'broadcaster' who connected only over HTTP through CLI)
      if (wsClient) {
        logger.debug(
          `WSClient ${util.inspect(
            wsClient.username,
          )} will be deleted from WSStore`,
        );
      }

      req.session.destroy((err) => {
        // You cannot access session here, it has been already destroyed
        if (err) logger.error(`${__filename}: ${err}`);

        if (wsClient) wsClient.socket.close();
        res.clearCookie(COOKIE_NAME);
        res.status(204).end();

        logger.debug(
          `${__filename}: Session Destroyed! User has been signed out.`,
        );
      });
    } catch (err) {
      next(err);
    }
  },
};

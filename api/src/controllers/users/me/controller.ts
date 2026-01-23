import path from "path";

import { Request, Response, NextFunction } from "express";

import { userService } from "../../../services/user/service";
import { HttpError } from "../../../utils/http-error";
import {
  type Permissions,
  type SanitizedUser,
  type Broadcast,
} from "../../../types";
import { logger } from "../../../config/logger";
import { COOKIE_NAME } from "../../../config/env";
import { cacheService } from "../../../services/cache";
import { sanitizeUser } from "../../../models/user/sanitize-user";
import { authnService } from "../../../services/authn";
import { broadcastService } from "../../../services/broadcast";
import { sendStreamfromBroadcaster } from "./push-stream";

export const meController = {
  destroyUser: async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.session.authenticatedUser!.userId;

      if (!(await userService.isUserExists({ userId }))) {
        res.status(204).end();
        logger.debug("Attempt to delete the user which doesn't exist");
      }

      await userService.destroyUser(userId);

      req.session.destroy((err) => {
        // You cannot access session here, it has already been destroyed
        if (err) logger.error(`${__filename}: ${err}`);

        res.clearCookie(COOKIE_NAME);
        res.status(204).end();

        logger.debug(
          `${__filename}: Session Destroyed! Account has been signed out.`,
        );
      });
    } catch (err) {
      next(err);
    }
  },

  readUser: async function (
    req: Request,
    res: Response<{ results: SanitizedUser | null }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await userService.readUser({
        userId: req.session.authenticatedUser!.userId,
      });

      const sanitizedUser = user ? sanitizeUser(user) : null;

      res.status(200).json({ results: sanitizedUser });
    } catch (err) {
      next(err);
    }
  },

  updatePassword: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      {
        email: string;
        token: string;
        newPassword: string;
      }
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (req.body.email) {
        // Do nothing on attempt to change pass before the email has been confirmed. Do not return errors to avoid revealing registered emails
        if (!(await userService.isEmailConfirmed({ email: req.body.email }))) {
          res.status(202).end();
          return;
        }

        if (await userService.isUserDeleted({ email: req.body.email })) {
          res.status(202).end();
          return;
        }

        await authnService.handlePasswordReset(req.body.email);
        res.status(202).end();
        return;
      }

      if (req.body.token && req.body.newPassword) {
        const { userId } = await userService.findByPasswordResetToken(
          req.body.token,
        );

        if (!userId) {
          throw new HttpError({
            code: 401,
            message: "Confirmation token is invalid",
          });
        }

        await userService.updatePassword({
          userId,
          newPassword: req.body.newPassword,
        });
        res.status(204).end();
      }
    } catch (err) {
      next(err);
    }
  },

  updateUser: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { username: string }
    >,
    res: Response<{
      results: {
        uuid: string;
        userId: number;
        email: string;
        username: string;
        permissions: Permissions;
      };
    }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.session.authenticatedUser!.userId;
      const username = req.body.username;

      if (await userService.isUserExists({ username })) {
        throw new HttpError({
          code: 409,
          message: "Sorry, this username is already taken",
        });
      }

      const updatedUser = await userService.updateUser({
        userId,
        username,
      });
      res.set("location", `/users/me`);
      res.status(200);
      res.json({ results: updatedUser });
    } catch (err) {
      next(err);
    }
  },

  broadcasts: {
    create: async function (
      req: Request<
        Record<string, unknown>,
        Record<string, unknown>,
        {
          broadcast: {
            title: string;
            startAt: string;
            endAt: string;
            description: string;
          };
        }
      >,
      res: Response<{ results: Broadcast }>,
      next: NextFunction,
    ): Promise<void> {
      try {
        const newBroadcast = await broadcastService.create({
          userId: req.session.authenticatedUser!.userId,
          artworkUrl: path.basename(req.file!.path),
          title: req.body.broadcast.title,
          startAt: req.body.broadcast.startAt,
          endAt: req.body.broadcast.endAt,
          description: req.body.broadcast.description,
        });
        res.set("location", `/users/me/broadcasts/${newBroadcast.broadcastId}`);
        res.status(200).send({ results: newBroadcast });
      } catch (err) {
        next(err);
      }
    },

    readAll: async function (
      req: Request<
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>,
        { time?: "past" | "current" | "future"; is_visible?: boolean }
      >,
      res: Response<{ results: Broadcast[] }>,
      next: NextFunction,
    ): Promise<void> {
      try {
        const cacheKey = `own_broadcasts_${req.query.time || ""}${req.query.is_visible || ""}`;
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
          logger.debug(`${__filename} Got cached data`);
          res.status(200).json(cachedData as { results: Broadcast[] });
          return;
        }

        const broadcasts = await broadcastService.readAllForUser(
          { userId: req.session.authenticatedUser!.userId },
          { isVisible: req.query.is_visible, time: req.query.time },
        );

        await cacheService.saveWithTTL(cacheKey, { results: broadcasts }, 300);

        res.status(200).json({ results: broadcasts });
      } catch (err) {
        next(err);
      }
    },

    update: async function (
      req: Request<
        { broadcastId?: number },
        Record<string, unknown>,
        {
          broadcast: {
            title?: string;
            description?: string;
            isVisible?: boolean;
            startAt?: string;
            endAt?: string;
          };
        }
      >,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await broadcastService.update({
          ...req.body.broadcast,
          userId: req.session.authenticatedUser!.userId,
          broadcastId: req.params.broadcastId!,
          artworkUrl: path.basename(req.file!.path),
        });

        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },

    destroy: async function (
      req: Request<{ broadcastId?: number }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await broadcastService.destroy(
          req.session.authenticatedUser!.userId,
          req.params.broadcastId!,
        );
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },

    stream: {
      sendStreamfromBroadcaster,
    },
  },
};

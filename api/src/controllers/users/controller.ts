import { Request, Response, NextFunction } from "express";

import { userService } from "../../services/user/service";
import { HttpError } from "../../utils/http-error";
import { CustomRequest, SortedBroadcasts } from "../../types";
import { SanitizedUser } from "../../types";
import { sanitizeUser } from "../../models/user/sanitize-user";
import { broadcastService } from "../../services/broadcast";

export const userController = {
  createUser: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { email: string }
    > &
      CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (
        !req.headers.basicauth?.username ||
        !req.headers.basicauth?.password
      ) {
        throw new HttpError({ code: 400 });
      }

      const username = req.headers.basicauth.username;
      const email = req.body.email;

      if (await userService.isUserExists({ username, email })) {
        throw new HttpError({
          code: 409,
          message: "Username or email already exists",
        });
      }
      await userService.createUser({
        username: req.headers.basicauth.username,
        password: req.headers.basicauth.password,
        email: req.body.email,
      });

      res.status(202).end();
    } catch (err) {
      console.log(err);
      next(err);
    }
  },

  readUserByUsername: async function (
    req: Request<{ username?: string }>,
    res: Response<{ results: SanitizedUser | null }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await userService.readUser({
        username: req.params.username!,
      });
      const sanitizedUser = user ? sanitizeUser(user) : null;

      res.status(200).json({ results: sanitizedUser });
    } catch (err) {
      next(err);
    }
  },

  readAllBroadcastsByUsername: async function (
    req: Request<
      { username?: string },
      Record<string, unknown>,
      Record<string, unknown>,
      { time?: "past" | "current" | "future" }
    >,
    res: Response<{ results: SortedBroadcasts }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const broadcasts = await broadcastService.readAllForUser(
        { username: req.params.username! },
        { time: req.query.time },
      );

      res.status(200).json({ results: broadcasts });
    } catch (err) {
      next(err);
    }
  },
};

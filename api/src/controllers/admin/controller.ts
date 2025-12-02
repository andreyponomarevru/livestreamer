import { Request, Response, NextFunction } from "express";
import { chatService } from "../../services/chat/service";
import { cacheService } from "../../services/cache";
import { logger } from "../../config/logger";
import { type User } from "../../models/user/user";
import { userService } from "../../services/user";

export const adminController = {
  destroyChatMessage: async function (
    req: Request<
      { broadcastId?: number; messageId?: number },
      Record<string, unknown>,
      Record<string, unknown>
    >,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await chatService.destroyAnyMsg({
        broadcastId: Number(req.params.broadcastId!),
        userUUID: req.session.authenticatedUser!.uuid!,
        messageId: Number(req.params.messageId as number),
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  readAllUsers: async function (
    req: Request,
    res: Response<{ results: Omit<User, "password">[] }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const cacheKey = `users`;
      const cachedData = await cacheService.get(cacheKey);
      if (cachedData) {
        logger.debug(`${__filename} Got cached data`);
        res
          .status(200)
          .json(cachedData as { results: Omit<User, "password">[] });
        return;
      }

      const users = await userService.readAllUsers();
      await cacheService.saveWithTTL(cacheKey, { results: users }, 300);
      res.status(200).json({ results: users });
    } catch (err) {
      next(err);
    }
  },
};

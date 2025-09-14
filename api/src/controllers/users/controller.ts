import { Request, Response, NextFunction } from "express";
import { userService } from "../../services/user/service";
import { logger } from "../../config/logger";
import { cacheService } from "../../services/cache/service";
import { User } from "../../models/user/user";

export const usersController = {
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

import { Request, Response, NextFunction } from "express";

import { HttpError } from "../utils/http-error";
import { logger } from "../config/logger";

// TODO looks like extraAuthZ is never used anywhere so you  can safely remove it but first write e2e tests for all routes

export function isAuthorized(
  action: string,
  resource: string,
  extraAuthZ?: ((req: Request) => boolean)[],
) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    logger.info(`${__filename}: Access "${resource}", action: "${action}"`);

    const authUser = req.session.authenticatedUser;
    const permissions = authUser!.permissions?.[resource];
    const hasPermission = permissions && permissions.includes(action);

    if (!hasPermission) {
      logger.error(`${__filename} Not authorized.`);
      next(
        new HttpError({
          code: 403,
          message: "You don't have permission to access this resource",
        }),
      );
      return;
    }

    if (!Array.isArray(extraAuthZ)) {
      logger.info(`${__filename} Authorized`);
      next();
      return;
    }

    const isAllowed = extraAuthZ.map((func) => func(req));
    if (!isAllowed.every((v) => v === true)) {
      logger.error(`${__filename} Not authorized. ExtraAuthZ failed`);
      next(
        new HttpError({
          code: 403,
          message: "You don't have permission to access this resource",
        }),
      );
      return;
    }

    logger.info(`${__filename} Authorized`);
    next();
  };
}

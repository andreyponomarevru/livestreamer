import util from "util";

import { Request, Response, NextFunction } from "express";

import { HttpError } from "../utils/http-error";
import { logger } from "../config/logger";

export function handle404Error(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Error 404 forwarded to main error handler`);
  logger.error(
    `Request to nonexistent resource:\nheaders:\n${util.inspect(
      req.headers,
    )}\nurl:\n${req.url}\npath:\n${req.path}`,
  );
  next(
    new HttpError({
      code: 404,
      message: `The requested page ${req.url} does not exist`,
    }),
  );
}

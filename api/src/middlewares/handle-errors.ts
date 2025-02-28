/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import util from "util";

import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { HttpError } from "../utils/http-error";
import { logger } from "../config/logger";

// Main error handler (this is a centralized error handler — all error handling logic is here)
// - handle errors passed to next() handler
// - handle errors thrown inside route handler
// - ...
export function handleErrors(
  err: Error | HttpError | any,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(`Express Main Error Handler\n${util.inspect(err)}`);

  switch (true) {
    case err instanceof HttpError:
      res.status(err.status).json(err);
      break;

    case err instanceof Joi.ValidationError:
      res.status(400).json(
        new HttpError({
          code: 400,
          message: err.details.map((err) => err.message).join("; "),
        }),
      );
      break;

    case ["23505"].includes(err.code):
      res.status(409).json(new HttpError({ code: 409 }));
      break;

    default:
      if (err.status) {
        res.status(err.status).json(new HttpError(err.status));
      } else {
        logger.error(err);
        res.status(500).json(new HttpError({ code: 500 }));
      }
  }
}

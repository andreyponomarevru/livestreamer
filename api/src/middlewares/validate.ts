/* eslint-disable @typescript-eslint/no-explicit-any */

import util from "util";

import { Request, Response, NextFunction } from "express";
import Joi from "joi";

import { logger } from "../config/logger";

type Schema =
  | Joi.ObjectSchema<any>
  | Joi.AlternativesSchema
  | Joi.StringSchema
  | Joi.NumberSchema
  | Joi.ArraySchema;

type Location = "body" | "headers" | "query" | "params";

export function validate(schema: Schema, location: Location) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    logger.debug(
      `${__filename}: [before validation] ${util.inspect(req[location])}`,
    );

    try {
      const validated = await schema.validateAsync(req[location]);

      Object.assign(req[location], validated);

      logger.debug(
        `${__filename}: [after validation] ${util.inspect(req[location])}`,
      );
    } catch (err) {
      next(err);
    }

    next();
  };
}

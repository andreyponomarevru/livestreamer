import Joi from "joi";
import express from "express";

import { parseBasicAuthorizationHeader } from "../../middlewares/parse-basic-authorization-header";
import {
  jsonContentTypeSchema,
  emailSchema,
  passwordSchema,
  usernameSchema,
  idSchema,
} from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { userController } from "./controller";
import { meRouter } from "./me/router";

export const usersRouter = express.Router().use("/me", meRouter);

usersRouter.post(
  "/",
  parseBasicAuthorizationHeader,
  validate(
    Joi.object({
      basicauth: Joi.object()
        .keys({
          schema: Joi.string()
            .trim()
            .required()
            .valid("basic")
            .insensitive()
            .messages({
              "string.base": `Authorization header should be a type of 'string'`,
              "string.empty": `Authorization header cannot be an empty string`,
              "any.only": `Authorization header type must be set to [Basic] authentication scheme`,
              "any.required": `Authorization header is required`,
            }),
          username: usernameSchema,
          password: passwordSchema,
        })
        .required()
        .messages({
          "any.required": "Authorization header is required",
        }),
    })
      .required()
      .unknown(true)
      .concat(jsonContentTypeSchema),
    "headers",
  ),
  validate(Joi.object({ email: emailSchema }).required(), "body"),
  userController.createUser,
);

usersRouter.get(
  "/:username",
  validate(Joi.object({ userId: idSchema }).required().unknown(true), "params"),
  userController.readUserById,
);

// Get all public broadcasts for any user
usersRouter.get(
  "/:username/broadcasts",
  validate(
    Joi.object({ username: usernameSchema }).required().unknown(true),
    "params",
  ),
  validate(
    Joi.object({
      time: Joi.string().allow("past", "current", "future").optional(),
      is_visible: Joi.boolean().optional(),
    })
      .optional()
      .unknown(true),
    "query",
  ),
  userController.readAllBroadcastsByUsername,
);

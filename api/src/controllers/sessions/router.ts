import Joi from "joi";
import express from "express";
import {
  jsonContentTypeSchema,
  emailSchema,
  usernameSchema,
  passwordSchema,
} from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { sessionController } from "./controller";

export const sessionRouter = express.Router();

sessionRouter.post(
  "/",
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.alternatives()
      .try(
        Joi.object({
          email: emailSchema.required(),
          password: passwordSchema.required(),
        }),
        Joi.object({
          username: usernameSchema.required(),
          password: passwordSchema.required(),
        }),
      )
      .match("one")
      .messages({
        "alternatives.any": "Invalid email, username or password",
      }),
    "body",
  ),
  sessionController.createSession,
);

sessionRouter.delete("/", isAuthenticated, sessionController.destroySession);

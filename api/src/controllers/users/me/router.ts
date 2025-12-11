import Joi from "joi";
import express from "express";
import { isAuthenticated } from "../../../middlewares/is-authenticated";
import { isAuthorized } from "../../../middlewares/is-authorized";
import {
  jsonContentTypeSchema,
  emailSchema,
  tokenSchema,
  passwordSchema,
  usernameSchema,
  idSchema,
  multipartContentTypeSchema,
} from "../../validation-schemas-common";
import { validate } from "../../../middlewares/validate";
import { meController } from "./controller";
import { uploadBroadcastArtwork } from "../../../middlewares/upload-broadcast-artwork";
import { parseMultipartJSONBody } from "../../../middlewares/parse-multipart-json-body";

export const meRouter = express.Router();

// Endpoints for the authenticated user's personal data management

meRouter.get("/", isAuthenticated, meController.readUser);

// User account

meRouter.patch(
  "/",
  isAuthenticated,
  isAuthorized("update", "own_user_account"),
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.object({ username: usernameSchema }).required().unknown(true),
    "body",
  ),
  meController.updateUser,
);

meRouter.delete(
  "/",
  isAuthenticated,
  isAuthorized("delete", "own_user_account"),
  meController.destroyUser,
);

// User's own broadcasts

meRouter.get(
  "/broadcasts",
  isAuthenticated,
  isAuthorized("read", "own_broadcast"),
  validate(
    Joi.object({
      time: Joi.string().allow("past", "current", "future").optional(),
      is_visible: Joi.boolean().optional(),
    })
      .optional()
      .unknown(true),
    "query",
  ),
  meController.broadcasts.readAll,
);

meRouter.post(
  "/broadcasts",
  isAuthenticated,
  isAuthorized("create", "own_broadcast"),
  validate(multipartContentTypeSchema, "headers"),
  uploadBroadcastArtwork({ isFileRequired: false }),
  parseMultipartJSONBody,
  validate(
    Joi.object({
      broadcast: Joi.object({
        title: Joi.string().trim().min(5).max(70).required(),
        startAt: Joi.date().iso().required().messages({
          "date.format":
            "'startAt' timestamp is in invalid format, string should be in ISO-8601",
        }),
        endAt: Joi.date().iso().required().messages({
          "date.format":
            "'endAt' timestamp is in invalid format, string should be in ISO-8601",
        }),
        description: Joi.string().trim().min(0).max(800).optional(),
      }).unknown(true),
    }).unknown(true),
    "body",
  ),
  meController.broadcasts.create,
);

meRouter.patch(
  "/broadcasts/:broadcastId",
  isAuthenticated,
  isAuthorized("update", "own_broadcast"),
  validate(multipartContentTypeSchema, "headers"),
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  uploadBroadcastArtwork({ isFileRequired: false }),
  parseMultipartJSONBody,
  validate(
    Joi.object({
      broadcast: Joi.object({
        title: Joi.string().trim().min(5).max(70).optional(),
        startAt: Joi.date().iso().optional().messages({
          "date.format":
            "'startAt' timestamp is in invalid format, string should be in ISO-8601",
        }),
        endAt: Joi.date().iso().optional().messages({
          "date.format":
            "'endAt' timestamp is in invalid format, string should be in ISO-8601",
        }),
        description: Joi.string().trim().min(0).max(800).optional().messages({
          "string.base": `'title' should be a type of 'string'`,
          "string.max": `'title' is longer than expected`,
        }),
        isVisible: Joi.boolean().optional().messages({
          "boolean.base": `'isVisible' should be a type of 'boolean'`,
        }),
      })
        .unknown(true)
        .min(2),
    }).unknown(),
    "body",
  ),
  meController.broadcasts.update,
);

meRouter.delete(
  "/broadcasts/:broadcastId",
  isAuthenticated,
  isAuthorized("delete", "own_broadcast"),
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  meController.broadcasts.destroy,
);

// Send binary stream from an authenticated user
meRouter.put(
  "/broadcasts/:broadcastId/stream",
  isAuthenticated,
  isAuthorized("create", "own_audio_stream"),
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  validate(
    Joi.object({
      "content-type": Joi.string().required().valid("audio/mpeg").messages({
        "string.base": `'content-type' should be a type of 'string'`,
        "string.empty": `'content-type' cannot be an empty string`,
        "any.required": `'content-type' is required`,
      }),
    })
      .required()
      .unknown(true),
    "headers",
  ),
  meController.broadcasts.stream.push,
);

// User settings

meRouter.patch(
  "/settings/password",
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.alternatives()
      .try(
        Joi.object({ email: emailSchema }),
        Joi.object({ token: tokenSchema, newPassword: passwordSchema }),
      )
      .match("one")
      .messages({ "alternatives.any": `Invalid email or token` }),
    "body",
  ),
  meController.updatePassword,
);

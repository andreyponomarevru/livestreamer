import Joi from "joi";
import express from "express";

import { isAuthenticated } from "../../middlewares/is-authenticated";
import { isAuthorized } from "../../middlewares/is-authorized";
import { jsonContentTypeSchema, idSchema } from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { broadcastController } from "./controller";

export const broadcastsRouter = express.Router();

// Stream

// Get audio stream for any broadcast
broadcastsRouter.get(
  "/:broadcastId/stream",
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  broadcastController.stream.relayStreamToListener,
);

// Send like for a stream
broadcastsRouter.put(
  "/:broadcastId/stream/likes",
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  isAuthenticated,
  broadcastController.stream.like,
);

// Chat

// Get all chat messages for specific broadcast
broadcastsRouter.get(
  "/:broadcastId/messages",
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  validate(
    Joi.object({
      next_cursor: Joi.string().base64().min(1).max(100).optional(),
      limit: Joi.number().integer().positive().min(1).max(50).optional(),
    }).optional(),
    "query",
  ),
  broadcastController.chat.readMessagesPaginated,
);

// Send message to a chat
broadcastsRouter.post(
  "/:broadcastId/messages",
  isAuthenticated,
  validate(
    Joi.object({ broadcastId: idSchema }).required().unknown(true),
    "params",
  ),
  validate(jsonContentTypeSchema, "headers"),
  validate(
    Joi.object({
      message: Joi.string().min(1).max(500).required().messages({
        "string.base": `'message' should be a type of 'string'`,
        "string.empty": `'message' cannot be an empty string`,
        "any.required": `'message' is required`,
      }),
    }),
    "body",
  ),
  broadcastController.chat.createMsg,
);

// Delete a message from chat
broadcastsRouter.delete(
  "/:broadcastId/messages/:messageId",
  isAuthenticated,
  isAuthorized("delete", "own_chat_message"),
  validate(
    Joi.object({ broadcastId: idSchema, messageId: idSchema })
      .required()
      .unknown(true),
    "params",
  ),
  broadcastController.chat.destroyMsg,
);

// Like chat message
broadcastsRouter.post(
  "/:broadcastId/messages/:messageId/likes",
  isAuthenticated,
  validate(
    Joi.object({ broadcastId: idSchema, messageId: idSchema })
      .required()
      .unknown(true),
    "params",
  ),
  broadcastController.chat.likeMsg,
);

// Unlike chat message
broadcastsRouter.delete(
  "/:broadcastId/messages/:messageId/likes",
  isAuthenticated,
  validate(
    Joi.object({ broadcastId: idSchema, messageId: idSchema })
      .required()
      .unknown(true),
    "params",
  ),
  broadcastController.chat.unlikeMsg,
);

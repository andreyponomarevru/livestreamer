import Joi from "joi";
import express from "express";
import { idSchema } from "../validation-schemas-common";
import { validate } from "../../middlewares/validate";
import { isAuthorized } from "../../middlewares/is-authorized";
import { isAuthenticated } from "../../middlewares/is-authenticated";
import { adminController } from "./controller";

export const adminRouter = express.Router();

adminRouter.delete(
  "/broadcasts/:broadcastId/messages/:messageId",
  isAuthenticated,
  isAuthorized("delete", "any_chat_message"),
  validate(
    Joi.object({ messageId: idSchema }).required().unknown(true),
    "params",
  ),
  validate(Joi.object({ user_id: idSchema }).optional().unknown(true), "query"),
  adminController.destroyChatMessage,
);

adminRouter.get(
  "/users",
  isAuthenticated,
  isAuthorized("read", "all_user_accounts"),
  adminController.readAllUsers,
);

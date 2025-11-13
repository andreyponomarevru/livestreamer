import { Request, Response, NextFunction } from "express";
import { chatService } from "../../services/chat/service";
import { ChatMsg } from "../../types";
import { HttpError } from "../../utils/http-error";

export const chatController = {
  createMsg: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { message: string }
    >,
    res: Response<{ results: ChatMsg }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const savedMsg = await chatService.createMsg({
        userUUID: req.session.authenticatedUser!.uuid!,
        userId: req.session.authenticatedUser!.id,
        message: req.body.message,
      });

      res.status(201).json({ results: savedMsg });
    } catch (err) {
      next(err);
    }
  },

  destroyOwnMsg: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await chatService.destroyMsg({
        userUUID: req.session.authenticatedUser!.uuid!,
        userId: req.session.authenticatedUser!.id,
        messageId: req.params.id!,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  likeMsg: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await chatService.likeMsg({
        userUUID: req.session.authenticatedUser!.uuid!,
        userId: req.session.authenticatedUser!.id,
        messageId: req.params.id!,
      });
      res.status(204).end();
    } catch (err) {
      if ("23503" === err.code) {
        next(new HttpError({ code: 422 }));
      } else {
        next(err);
      }
    }
  },

  readMsgsPaginated: async function (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      { next_cursor?: string; limit?: number }
    >,
    res: Response<{
      results: { nextCursor: string | null; messages: ChatMsg[] };
    }>,
    next: NextFunction,
  ): Promise<void> {
    try {
      const limit = req.query.limit || 50;
      const nextCursor = req.query.next_cursor;

      const msgs = await chatService.readMsgsPaginated(limit, nextCursor);

      res.status(200).json({ results: msgs });
    } catch (err) {
      next(err);
    }
  },

  unlikeMsg: async function (
    req: Request<{ id?: number }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await chatService.unlikeMsg({
        messageId: req.params.id!,
        userUUID: req.session.authenticatedUser!.uuid!,
        userId: req.session.authenticatedUser!.id,
      });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
};

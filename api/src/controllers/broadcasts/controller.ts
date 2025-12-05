import { Request, Response, NextFunction } from "express";

import { streamService, inoutStream } from "../../services/stream";
import { cacheService } from "../../services/cache";
import { HttpError } from "../../utils/http-error";
import { pull } from "./pull-stream";
import { chatService } from "../../services/chat/service";
import { type Broadcast, type ChatMsg } from "../../types";
import { logger } from "../../config/logger";
import { broadcastService } from "../../services/broadcast";

export const broadcastController = {
  broadcasts: {
    read: async function (
      req: Request<{ broadcastId?: number }>,
      res: Response<{ results: Broadcast | null }>,
      next: NextFunction,
    ): Promise<void> {
      try {
        const cacheKey = `broadcasts_${req.params.broadcastId}`;
        const cachedData = await cacheService.get(cacheKey);
        if (cachedData) {
          logger.debug(`${__filename} Got cached data`);
          res.status(200).json(cachedData as { results: Broadcast });
          return;
        }

        const broadcast = await broadcastService.read(req.params.broadcastId!);

        await cacheService.saveWithTTL(cacheKey, { results: broadcast }, 300);

        res.status(200).json({ results: broadcast });
      } catch (err) {
        next(err);
      }
    },
  },

  stream: {
    like: async function (
      req: Request<{ broadcastId?: number }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        if (inoutStream.isPaused())
          throw new HttpError({
            code: 410,
            message: "The broadcast (stream) has finished",
          });

        await streamService.likeStream({
          userUUID: req.session.authenticatedUser!.uuid!,
          userId: req.session.authenticatedUser!.userId,
          broadcastId: req.params.broadcastId!,
        });
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },

    pull,
  },

  chat: {
    createMsg: async function (
      req: Request<
        { broadcastId?: number },
        Record<string, unknown>,
        { message: string }
      >,
      res: Response<{ results: ChatMsg }>,
      next: NextFunction,
    ): Promise<void> {
      try {
        const savedMsg = await chatService.createMsg({
          broadcastId: req.params.broadcastId!,
          userUUID: req.session.authenticatedUser!.uuid!,
          userId: req.session.authenticatedUser!.userId,
          message: req.body.message,
        });

        res.status(201).json({ results: savedMsg });
      } catch (err) {
        next(err);
      }
    },

    destroyMsg: async function (
      req: Request<{ broadcastId?: number; messageId?: number }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await chatService.destroyMsg({
          broadcastId: req.params.broadcastId!,
          userUUID: req.session.authenticatedUser!.uuid!,
          userId: req.session.authenticatedUser!.userId,
          messageId: req.params.messageId!,
        });
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },

    likeMsg: async function (
      req: Request<{ broadcastId?: number; messageId?: number }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await chatService.likeMsg({
          broadcastId: req.params.broadcastId!,
          userUUID: req.session.authenticatedUser!.uuid!,
          userId: req.session.authenticatedUser!.userId,
          messageId: req.params.messageId!,
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

    readMessagesPaginated: async function (
      req: Request<
        { broadcastId?: number },
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
        const msgs = await chatService.readMsgsPaginated({
          broadcastId: req.params!.broadcastId as number,
          limit: req.query.limit || 50,
          nextCursor: req.query.next_cursor,
        });

        res.status(200).json({ results: msgs });
      } catch (err) {
        next(err);
      }
    },

    unlikeMsg: async function (
      req: Request<{ broadcastId?: number; messageId?: number }>,
      res: Response,
      next: NextFunction,
    ): Promise<void> {
      try {
        await chatService.unlikeMsg({
          broadcastId: req.params.broadcastId!,
          messageId: req.params.messageId!,
          userUUID: req.session.authenticatedUser!.uuid!,
          userId: req.session.authenticatedUser!.userId,
        });
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  },
};

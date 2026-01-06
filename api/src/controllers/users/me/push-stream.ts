import { PassThrough } from "stream";

import { Request, Response, NextFunction } from "express";

import { logger } from "../../../config/logger";
import { streamService } from "../../../services/stream/service";
import { wsService } from "../../../services/ws/service";
import { broadcastService } from "../../../services/broadcast";
import { HttpError } from "../../../utils/http-error";

export async function sendStreamfromBroadcaster(
  req: Request<{ broadcastId?: number }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const MAX_CLIENT_BUFFER = 512 * 1024; // 512KB threshold before dropping

  try {
    const userId = req.session.authenticatedUser!.userId;
    const broadcastId = Number(req.params.broadcastId!);

    const broadcast = await broadcastService.readForUser(userId, broadcastId);
    if (!broadcast) {
      throw new HttpError({
        code: 404,
        message: `There is no broadcast with id ${broadcastId}. You have to create a broadcast first before starting a stream.`,
      });
    }

    const isAlreadyStreaming = await streamService.isBroadcastStreaming(
      userId,
      broadcastId,
    );
    if (isAlreadyStreaming) {
      throw new HttpError({
        code: 403,
        message: `The broadcast ${broadcastId} is already streaming. You can't have more than one stream per broadcast`,
      });
    }

    const isTimeToBroadcast = await broadcastService.isTimestampInRange(
      new Date().toISOString(),
      { start: broadcast.startAt, end: broadcast.endAt },
    );
    if (!isTimeToBroadcast) {
      throw new HttpError({
        code: 403,
        message:
          "You can't stream because there is no scheduled broadcast for the current moment. Go to the UI, schedule a new broadcast and send a request anytime between start_at and ent_at timestamps",
      });
    }

    await streamService.startBroadcastStream({
      broadcastId,
      userId,
      listenersCount: wsService.clientStore.getClientsCount(
        broadcast.broadcastId,
      ),
    });

    logger.debug("Starting push stream from broadcaster to server...");

    function broadcastData(chunk: Buffer) {
      const listeners = streamService.streamsHub.get(broadcastId)?.listeners;

      if (!listeners) {
        logger.debug(`No broadcast id ${broadcastId}`);
        return;
      }

      for (const clientResponse of listeners) {
        // Prevent a single user from slowing down the stream for all users
        if (
          clientResponse.writableNeedDrain ||
          clientResponse.writableLength >= MAX_CLIENT_BUFFER
        ) {
          continue;
        } else {
          const canAcceptsMore = clientResponse.write(chunk);
          if (!canAcceptsMore) logger.debug("The client is lagging");
        }
      }
    }

    function cleanup(err: Error) {
      req.destroy();
      relay.destroy();
      listeners.forEach((clientResponse) => clientResponse.end());
      listeners.clear();
      streamService.streamsHub.delete(broadcastId);

      streamService.endBroadcastStream(userId, broadcastId).catch(logger.error);

      if (err) {
        logger.error(`Broadcaster stream pipeline failed: ${err}`);
        if (!res.headersSent) res.status(500).end();
      } else {
        logger.debug("Broadcaster has closed the streaming request.");
        res.status(200).end();
      }
    }

    const relay = new PassThrough({ highWaterMark: 8 * 1024 });
    const listeners = new Set<Response>();

    relay.setMaxListeners(0); // Support unlimited number of broadcasters
    relay.on("data", broadcastData);
    relay.once("end", cleanup);
    relay.once("error", cleanup);

    req.on("close", () => cleanup(new Error("Broadcaster connection closed")));
    req.pipe(relay);

    streamService.streamsHub.set(broadcastId, { stream: relay, listeners });
  } catch (err) {
    next(err);
  }
}

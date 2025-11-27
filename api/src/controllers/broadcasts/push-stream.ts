import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger";
import { streamService, inoutStream } from "../../services/stream/service";
import { wsService } from "../../services/ws/service";
import { printReadableStreamMode } from "../../utils/print-readable-stream-mode";
import { broadcastService } from "../../services/broadcast";
import { HttpError } from "../../utils/http-error";

export async function push(
  req: Request<{ broadcastId?: number }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const broadcast = await broadcastService.readForUser(
      req.session.authenticatedUser!.userId,
      req.params.broadcastId!,
    );
    if (!broadcast) {
      throw new HttpError({
        code: 404,
        message: `There is no broadcast with id ${req.params.broadcastId}. You have to create a broadcast before starting a stream.`,
      });
    }

    const isAlreadyStreaming = await streamService.isBroadcastStreaming(
      req.session.authenticatedUser!.userId,
      req.params.broadcastId!,
    );
    if (isAlreadyStreaming) {
      throw new HttpError({
        code: 403,
        message: `The broadcast ${req.params.broadcastId} is already streaming. You can't have more than one stream per broadcast`,
      });
    }

    const isTimeToBroadcast = await broadcastService.isISOTimestampInRange(
      new Date().toISOString(),
      broadcast.startAt,
      broadcast.endAt,
    );
    if (!isTimeToBroadcast) {
      throw new HttpError({
        code: 403,
        message:
          "You can't stream because there is no scheduled broadcast for the current moment. Go to the UI, schedule a new broadcast and send a request anytime between start_at and ent_at timestamps",
      });
    }

    wsService.clientStore.on(
      "update_client_count",
      streamService.updateListenerPeakCount,
    );

    inoutStream.once("pause", () => {
      wsService.clientStore.removeListener(
        "update_client_count",
        streamService.updateListenerPeakCount,
      );
    });

    await streamService.startBroadcastStream({
      broadcastId: req.params.broadcastId!,
      userId: req.session.authenticatedUser!.userId,
      listenersNow: wsService.clientStore.clientCount,
    });

    logger.debug(`${__filename} Starting push stream from client to server...`);
    // When broadcast-client connects, switch the stream back into the 'flowing' mode, otherwise later we won't be able to push data to listener-clients requests
    inoutStream.resume();

    req.on("data", onReqData);
    req.on("error", (err) =>
      onErr(
        err,
        req.session.authenticatedUser!.userId,
        req.params.broadcastId!,
      ),
    );
    req.on("end", onEnd);
    req.on("close", () =>
      onClose(req.session.authenticatedUser!.userId, req.params.broadcastId!),
    );
  } catch (err) {
    next(err);
  }
}

async function onReqData(chunk: Buffer) {
  //showReadableStreamMode(
  //  streamService.inoutStream,
  //  "broadcaster's push stream",
  //);

  // Push incoming request data into Readable stream in order to be able to consume it later on listener-client request (it doesn't accumulates in memory, it is just lost)
  inoutStream.push(chunk);
}

async function onClose(userId: number, broadcastId: number) {
  logger.debug(
    `${__filename} [close] Broadcasting client has closed the request (push audio stream).`,
  );
  await streamService.endBroadcastStream(userId, broadcastId);

  // We shouldn't use 'close' and/or 'end' methods on the read/write streams of our duplex stream, otherwise the broadcast-client won't be able to reconnect and start pushing again until the server restart. 'pause' is the most appropriate alternative to these methods
  inoutStream.pause();
  printReadableStreamMode(inoutStream, "broadcaster's push stream");
}

function onEnd() {
  logger.debug(`${__filename} [end] No more data in request stream.`);
  printReadableStreamMode(inoutStream, "broadcaster's push stream");
}

async function onErr(err: Error, userId: number, broadcastId: number) {
  logger.error(`${__filename} [error] ${err}`);
  printReadableStreamMode(inoutStream, "broadcaster's push stream");
  await streamService.endBroadcastStream(userId, broadcastId);
}

import { Request, Response, NextFunction } from "express";

import { logger } from "../../config/logger";
import { streamService } from "../../services/stream";
import { HttpError } from "../../utils/http-error";

export function relayStreamToListener(
  req: Request<{ broadcastId?: string }>,
  res: Response,
  next: NextFunction,
): void {
  const broadcastId = Number(req.params.broadcastId!);

  const relay = streamService.streamsHub.get(broadcastId)?.stream;

  if (!relay) {
    res.status(404).send(
      new HttpError({
        code: 404,
        message: "The requested page does not exist",
      }),
    );
    return;
  }

  const listeners = streamService.streamsHub.get(broadcastId)?.listeners;

  listeners?.add(res);

  res.writeHead(200, {
    "content-type": "audio/mpeg",
    "transfer-encoding": "chunked",
    connection: "keep-alive",
    "cache-control": "no-cache, no-store, must-revalidate",
    pragma: "no-cache",
    expires: "0",
    // If it doesn't work, add this header to Nginx config:
    "X-Accel-Buffering": "no",
  });

  function cleanup() {
    streamService.streamsHub.get(broadcastId)?.listeners.delete(res);
  }

  res.on("error", cleanup);
  res.on("close", cleanup);

  logger.debug(listeners);
}

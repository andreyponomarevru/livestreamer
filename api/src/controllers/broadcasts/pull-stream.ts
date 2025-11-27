import { Request, Response, NextFunction } from "express";
import { logger } from "../../config/logger";
import { HttpError } from "../../utils/http-error";
import { inoutStream } from "../../services/stream";

export function pull(req: Request, res: Response, next: NextFunction): void {
  logger.debug("[data] event listeners: ", inoutStream.listeners("data")); // added below by 'pipe' method
  logger.debug("[pause] event listeners: ", inoutStream.listeners("pause")); // added below manually

  // Before doing anything further, check whether the broadcaster-client is actually streaming.
  // If the stream is in the flowing mode, that means the broadcast-client is streaming, hence we're able to send the stream to listener-clients and we set response code to 200. Next, the 'data' event handler will be triggered starting sending the stream.
  // If the stream is paused, it means the broadcaster doesn't stream.

  if (inoutStream.readableFlowing) {
    res.writeHead(200, {
      "content-type": "audio/mpeg",
      "transfer-encoding": "chunked",
      connection: "keep-alive",
      "cache-control": "no-cache, no-store, must-revalidate",
      pragma: "no-cache",
      expires: "0",
    });

    /// 'pipe' automatically switches the stream back into the 'flowing' mode
    inoutStream.pipe(res);
    inoutStream.on("pause", res.end);
    req.on("close", () => {
      inoutStream.removeListener("pause", res.end);
    });
  } else {
    next(
      new HttpError({
        code: 404,
        message: "The requested page does not exist",
      }),
    );
  }
}

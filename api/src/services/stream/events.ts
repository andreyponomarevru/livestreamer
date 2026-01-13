import util from "util";
import EventEmitter from "events";

import { logger } from "../../config/logger";
import { type SavedBroadcastLike } from "../../types";

export class StreamEmitter extends EventEmitter {
  start(broadcast: {
    userId: number;
    broadcastId: number;
    listenerPeakCount: number;
    likeCount: number;
  }): void {
    logger.debug(`StreamEmitter ['start'] ${util.inspect(broadcast)}`);
    this.emit("start", broadcast);
  }

  end(broadcastId: number): void {
    logger.debug(`StreamEmitter ['end'] ${util.inspect(broadcastId)}`);
    this.emit("end", broadcastId);
  }

  like(like: SavedBroadcastLike & { likedByUserUUID: string }): void {
    logger.debug(`StreamEmitter ['like'] ${util.inspect(like)}`);
    this.emit("like", like);
  }

  newListenersPeak(newPeakCount: { broadcastId: number; count: number }): void {
    logger.debug(
      `StreamEmitter ['listeners_peak'] ${util.inspect(newPeakCount)}`,
    );
    this.emit("listeners_peak", newPeakCount);
  }
}

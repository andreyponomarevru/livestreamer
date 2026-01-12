import util from "util";

import { logger } from "../../../src/config/logger";

interface Scheduler {
  start: (roomId: number, interfval: number, callback: () => void) => void;
  stop: (roomId: number) => void;
  timerIds: Map<number, NodeJS.Timeout>;
}

class IntervalScheduler implements Scheduler {
  timerIds = new Map<number, NodeJS.Timeout>();

  start(
    roomId: number,
    interval: number,
    callback: () => void,
  ): NodeJS.Timeout {
    const id = setInterval(callback, interval);
    this.timerIds.set(roomId, id);

    return id;
  }

  stop(roomId: number): void {
    const id = this.timerIds.get(roomId);

    clearInterval(id);
    this.timerIds.delete(roomId);

    logger.debug(
      `${__filename} WS Scheduler has been stopped.\nAll currently existing timers: ${util.inspect(this.timerIds)}`,
    );
  }
}

export { Scheduler, IntervalScheduler };

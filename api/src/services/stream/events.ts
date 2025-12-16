import EventEmitter from "events";
import { type Broadcast, type SavedBroadcastLike } from "../../types";

export class StreamEmitter extends EventEmitter {
  start(broadcast: Broadcast & { listenersCount: number | undefined }): void {
    this.emit("start", broadcast);
  }

  end(broadcastId: number): void {
    this.emit("end", broadcastId);
  }

  like(like: SavedBroadcastLike & { likedByUserUUID: string }): void {
    this.emit("like", like);
  }

  newListenersPeak(newPeakCount: { broadcastId: number; count: number }): void {
    this.emit("listeners_peak", newPeakCount);
  }
}

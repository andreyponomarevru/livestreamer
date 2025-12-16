import fs from "fs";

import { InOutStream } from "./inout-stream";
import { type BroadcastStreamWebSocketData } from "../../types";
import { broadcastRepo } from "../../models/broadcast/queries";
import { streamRepo } from "../../models/stream/queries";
import { StreamEmitter } from "./events";

export const streamService = {
  events: new StreamEmitter(),

  readBroadcastStreamState: async function (
    broadcastId: number,
  ): Promise<BroadcastStreamWebSocketData> {
    if (inoutStream.isPaused()) {
      return { isStreaming: false };
    } else {
      const broadcastStream = await streamRepo.read(broadcastId);
      return { isStreaming: true, broadcast: broadcastStream };
    }
  },

  startBroadcastStream: async function ({
    broadcastId,
    userId,
    listenersCount,
  }: {
    broadcastId: number;
    userId: number;
    listenersCount: number | undefined;
  }): Promise<void> {
    const broadcast = await broadcastRepo.readForUser(userId, broadcastId);
    if (!broadcast) return;
    const broadcastStream = await streamRepo.read(broadcastId);

    this.events.start({ ...broadcast, ...broadcastStream, listenersCount });
  },

  endBroadcastStream: async function (
    userId: number,
    broadcastId: number,
  ): Promise<void> {
    this.events.end(broadcastId);

    await broadcastRepo.update({
      userId,
      broadcastId,
      listenerPeakCount: await streamRepo.readListenerPeakCount(broadcastId),
      endAt: new Date().toISOString(),
    });
    await streamRepo.destroy(userId, broadcastId);
  },

  updateListenerPeakCount: async function (
    broadcastId: number,
    newPeakCount: number,
  ): Promise<void> {
    const peakCount = await streamRepo.readListenerPeakCount(broadcastId);
    if (newPeakCount > peakCount) {
      await streamRepo.updateListenerPeakCount(broadcastId, newPeakCount);
      this.events.newListenersPeak({ broadcastId, count: newPeakCount });
    }
  },

  isBroadcastStreaming: async function (
    userId: number,
    broadcastId: number,
  ): Promise<boolean> {
    return await streamRepo.isExist(userId, broadcastId);
  },

  likeStream: async function ({
    userUUID,
    userId,
    username,
    broadcastId,
  }: {
    userUUID: string;
    userId: number;
    username: string;
    broadcastId: number;
  }): Promise<void> {
    const { likesCount } = await streamRepo.createLike(userId, broadcastId);

    this.events.like({
      likedByUserId: userId,
      likedByUserUUID: userUUID,
      likedByUsername: username,
      likeCount: likesCount,
      broadcastId,
    });
  },
};

export const inoutStream = new InOutStream();
// By default, new readable streams are set to the 'paused' mode. But when we add 'data' event handler or use `pipe`, we auto set readable stream into 'flowing' mode. So, when there are no listeners (hence no 'pipe' method is attached to stream), the stream will switch back to pause mode (although broadcaster may still continue to stream). We don't want that to happen, so to set the stream to flowing mode from the ground up, we pipe it to nowhere. It doesn't matter where to pipe, as long as the 'pipe' method is used, because as I've already mentioned, we use 'pipe' only to set the stream into 'flowing' mode and don't care where it will send data
inoutStream.pipe(fs.createWriteStream("\\\\.\\NUL"));
// Pause the stream on app startup because initially there is no broadcaster, so there is nothing to stream. Without pausing, clients trying to connect won't recieve 404, the request will just hang without response
inoutStream.pause();

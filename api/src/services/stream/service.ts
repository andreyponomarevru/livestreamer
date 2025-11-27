import fs from "fs";

import { InOutStream } from "./inout-stream";
import { type BroadcastStreamWebSocketData } from "../../types";
import { broadcastRepo } from "../../models/broadcast/queries";
import { streamRepo } from "../../models/stream/queries";
import { StreamEmitter } from "./events";

export const streamService = {
  events: new StreamEmitter(),

  readBroadcastStreamState: async function (
    userId: number,
    broadcastId: number,
  ): Promise<BroadcastStreamWebSocketData> {
    if (inoutStream.isPaused()) {
      return { isStreaming: false };
    } else {
      const broadcastStream = await streamRepo.read(userId, broadcastId);
      return { isStreaming: true, broadcast: broadcastStream };
    }
  },

  startBroadcastStream: async function (broadcast: {
    broadcastId: number;
    userId: number;
    listenersNow: number;
  }): Promise<void> {
    const currentBroadcast = await broadcastRepo.readForUser(
      broadcast.userId,
      broadcast.broadcastId,
    );

    if (!currentBroadcast) return;

    const broadcastStream = await streamRepo.read(
      broadcast.userId,
      broadcast.broadcastId,
    );
    this.events.start({ ...currentBroadcast, ...broadcastStream });
  },

  endBroadcastStream: async function (
    userId: number,
    broadcastId: number,
  ): Promise<void> {
    this.events.end();

    await broadcastRepo.update({
      userId,
      broadcastId,
      listenerPeakCount: await streamRepo.readListenerPeakCount(
        userId,
        broadcastId,
      ),
      endAt: new Date().toISOString(),
    });
    await streamRepo.destroy(userId, broadcastId);
  },

  updateListenerPeakCount: async function (
    userId: number,
    broadcastId: number,
    listenersNow: number,
  ): Promise<void> {
    if (
      listenersNow >
      (await streamRepo.readListenerPeakCount(userId, broadcastId))
    ) {
      await streamRepo.updateListenerPeakCount(
        userId,
        broadcastId,
        listenersNow,
      );
      this.events.newListenersPeak(listenersNow);
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
    broadcastId,
  }: {
    userUUID: string;
    userId: number;
    broadcastId: number;
  }): Promise<void> {
    const like = await streamRepo.createLike(userId, broadcastId);

    this.events.like({
      likedByUserId: userId,
      likedByUserUUID: userUUID,
      likedByUsername: like.likedByUsername,
      likeCount: like.likeCount,
      broadcastId,
    });
  },
};

export const inoutStream = new InOutStream();
// By default, new readable streams are set to the 'paused' mode. But when we add 'data' event handler or use `pipe`, we auto set readable stream into 'flowing' mode. So, when there are no listeners (hence no 'pipe' method is attached to stream), the stream will switch back to pause mode (although broadcaster may still continue to stream). We don't want that to happen, so to set the stream to flowing mode from the ground up, we pipe it to nowhere. It doesn't matter where to pipe, as long as the 'pipe' method is used, because as I've already mentioned, we use 'pipe' only to set the stream into 'flowing' mode and don't care where it will send data
inoutStream.pipe(fs.createWriteStream("\\\\.\\NUL"));
// Pause the stream on app startup because initially there is no broadcaster, so there is nothing to stream. Without pausing, clients trying to connect won't recieve 404, the request will just hang without response
inoutStream.pause();

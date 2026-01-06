import { type PassThrough } from "stream";

import { Response } from "express";

import { type BroadcastStreamWebSocketData } from "../../types";
import { broadcastRepo } from "../../models/broadcast/queries";
import { streamRepo } from "../../models/stream/queries";
import { StreamEmitter } from "./events";

export const streamService = {
  streamsHub: new Map() as Map<
    number,
    { stream: PassThrough; listeners: Set<Response> }
  >,

  events: new StreamEmitter(),

  readBroadcastStreamState: async function (
    broadcastId: number,
  ): Promise<BroadcastStreamWebSocketData> {
    if (!streamService.streamsHub.has(broadcastId)) {
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
    });
    await streamRepo.destroy(userId, broadcastId);
  },

  updateListenerPeakCount: async function ({
    broadcastId,
    count,
  }: {
    broadcastId: number;
    count: number;
  }): Promise<void> {
    const oldPeakCount = await streamRepo.readListenerPeakCount(broadcastId);
    if (count > oldPeakCount) {
      await streamRepo.updateListenerPeakCount(broadcastId, count);
      this.events.newListenersPeak({ broadcastId, count: count });
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

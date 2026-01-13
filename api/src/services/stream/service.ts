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
  }: {
    broadcastId: number;
    userId: number;
  }): Promise<void> {
    const broadcast = await broadcastRepo.readForUser(userId, broadcastId);
    if (!broadcast) return;

    const newStream = {
      userId: broadcast.userId,
      broadcastId: broadcast.broadcastId,
      likeCount: broadcast.likeCount,
      listenerPeakCount: broadcast.listenerPeakCount,
    };

    await streamRepo.create(newStream);
    this.events.start(newStream);
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
    roomId,
    count,
  }: {
    roomId: number;
    count: number;
  }): Promise<void> {
    const oldPeakCount = await streamRepo.readListenerPeakCount(roomId);
    if (count > oldPeakCount) {
      await streamRepo.updateListenerPeakCount(roomId, count);
      this.events.newListenersPeak({ broadcastId: roomId, count: count });
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

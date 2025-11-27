import { broadcastRepo } from "../../models/broadcast/queries";
import { Broadcast, BroadcastFilters } from "../../types";

export const broadcastService = {
  create: async function (newBroadcast: {
    userId: number;
    title: string;
    artworkUrl: string;
    description?: string;
    startAt: string;
    endAt: string;
  }) {
    // TODO: dissalow creating broadcasts longer than 3 hours

    // TODO: check that the new broadcast doesn't overlap with any existing one. If there is overlapping, return a sensible error to be able to print in UI: "Can't schedule the broadcast because you've already scheduled one on the Your already have scheduled a broadcast on that time"

    return await broadcastRepo.create({
      userId: newBroadcast.userId,
      title: newBroadcast.title,
      startAt: newBroadcast.startAt,
      endAt: newBroadcast.endAt,
      listenerPeakCount: 0,
      isVisible: true,
      artworkUrl: newBroadcast.artworkUrl,
      description: newBroadcast.description || "",
    });
  },

  read: async function (broadcastId: number) {
    return await broadcastRepo.read(broadcastId);
  },

  readForUser: async function (
    userId: number,
    broadcastId: number,
  ): Promise<Broadcast | null> {
    return await broadcastRepo.readForUser(userId, broadcastId);
  },

  readAllForUser: async function (
    user: { userId?: number; username?: string },
    filters?: BroadcastFilters,
  ): Promise<Broadcast[]> {
    return await broadcastRepo.readAll(user, filters);
  },

  update: async function (updatedBroadcast: {
    userId: number;
    broadcastId: number;
    title?: string;
    artworkUrl?: string;
    description?: string;
    startAt?: string;
    endAt?: string;
    isVisible?: boolean;
  }) {
    // TODO: check that the updated broadcast doesn't overlap in time (schedule) with any existing one. If there is overlapping, return a sensible error to be able to print in UI
    return await broadcastRepo.update(updatedBroadcast);
  },

  destroy: async function (userId: number, broadcastId: number) {
    return await broadcastRepo.destroy(userId, broadcastId);
  },

  isExist: async function (userId: number, broadcastId: number) {
    return await broadcastRepo.isExist(userId, broadcastId);
  },

  isISOTimestampInRange: function (
    current: string,
    start: string,
    end: string,
  ) {
    const currentTs = new Date(current);
    const startTs = new Date(start);
    const endTs = new Date(end);

    return currentTs >= startTs && currentTs < endTs;
  },
};

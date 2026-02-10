import path from "path";

import dateFns from "date-fns";

import { UPLOADED_BROADCAST_ARTWORKS_IMG_DIR } from "../../config/env";
import { broadcastRepo } from "../../models/broadcast/queries";
import { Broadcast, BroadcastFilters, SortedBroadcasts } from "../../types";

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
  ): Promise<SortedBroadcasts> {
    const broadcasts = await broadcastRepo.readAll(user, filters);

    const broadcastsWithArtworks = broadcasts.map((b) => {
      return {
        ...b,
        artworkUrl: path.join(
          UPLOADED_BROADCAST_ARTWORKS_IMG_DIR,
          b.artworkUrl,
        ),
      };
    });

    const past: Broadcast[] = [];
    const current: Broadcast[] = [];
    const future: Broadcast[] = [];

    const now = new Date();
    broadcastsWithArtworks.forEach((broadcast) => {
      if (dateFns.isAfter(broadcast.startAt, now)) future.push(broadcast);
      else if (dateFns.isBefore(broadcast.endAt, now)) past.push(broadcast);
      else current.push(broadcast);
    });

    return { past, current, future };
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
    // TODO: check that the updated broadcast doesn't overlap in time (schedule) with any existing one. If there is overlapping, return a sensible error to be able to print in UI. dateFns.areIntervalsOverlapping(...) or do it in SQL: SELECT (start1, end1) OVERLAPS (start2, end2);

    await broadcastRepo.update(updatedBroadcast);
  },

  destroy: async function (userId: number, broadcastId: number) {
    return await broadcastRepo.destroy(userId, broadcastId);
  },

  isExist: async function (userId: number, broadcastId: number) {
    return await broadcastRepo.isExist(userId, broadcastId);
  },

  isTimestampInRange: function (
    currentTs: string,
    range: { start: string; end: string },
  ) {
    return dateFns.isWithinInterval(new Date(currentTs), {
      start: new Date(range.start),
      end: new Date(range.end),
    });
  },
};

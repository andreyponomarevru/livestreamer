import { redisConnection } from "../../config/redis";
import { dbConnection } from "../../config/postgres";
import { BroadcastStream } from "../../types";

export const streamRepo = {
  create: async function (broadcast: BroadcastStream): Promise<void> {
    const client = await redisConnection.open();

    const stringifiedBroadcast: { [key: string]: string } = {};
    Object.keys(broadcast).map((key) => {
      stringifiedBroadcast[key] = String(
        broadcast[key as keyof BroadcastStream],
      );
    });

    await client.HSET(
      this.getRedisBroadcastStreamKey(broadcast.userId, broadcast.broadcastId),
      stringifiedBroadcast,
    );
  },

  destroy: async function (userId: number, broadcastId: number): Promise<void> {
    const client = await redisConnection.open();
    await client.del(`livebroadcast:${userId}:${broadcastId}`);
  },

  read: async function (
    userId: number,
    broadcastId: number,
  ): Promise<BroadcastStream> {
    const client = await redisConnection.open();
    const broadcast = await client.HGETALL(
      this.getRedisBroadcastStreamKey(userId, broadcastId),
    );

    return {
      userId: Number(broadcast.userId),
      broadcastId: Number(broadcast.id),
      title: broadcast.title,
      listenerPeakCount: Number(broadcast.listenerPeakCount),
      likeCount: Number(broadcast.likeCount),
      startAt: broadcast.startAt,
      endAt: broadcast.endAt,
    };
  },

  isExist: async function (
    userId: number,
    broadcastId: number,
  ): Promise<boolean> {
    const client = await redisConnection.open();
    return Boolean(
      await client.exists(this.getRedisBroadcastStreamKey(userId, broadcastId)),
    );
  },

  updateListenerPeakCount: async function (
    userId: number,
    broadcastId: number,
    count: number,
  ): Promise<void> {
    const client = await redisConnection.open();
    await client.HSET(this.getRedisBroadcastStreamKey(userId, broadcastId), {
      listenerPeakCount: `${count}`,
    });
  },

  readListenerPeakCount: async function (
    userId: number,
    broadcastId: number,
  ): Promise<number> {
    const client = await redisConnection.open();
    return Number(
      await client.HGET(
        this.getRedisBroadcastStreamKey(userId, broadcastId),
        "listenerPeakCount",
      ),
    );
  },

  createLike: async function (
    userId: number,
    broadcastId: number,
  ): Promise<{
    broadcastId: number;
    likedByUserId: number;
    likedByUsername: string;
    likeCount: number;
  }> {
    // TODO looks like you retrieve only particular user's likes, but you need to retrieve ALL user likes

    // If the user already has liked the broadcast, 'ON CONFLICT' clause allows us to just increment the counter of an existing row
    const insertSql =
      "WITH like_counter AS (\
      /* Insert like */ \
      INSERT INTO \
        broadcast_like (broadcast_id, appuser_id, count) \
      VALUES \
        ($1, $2, 1) \
      ON CONFLICT \
        (broadcast_id, appuser_id) \
      DO UPDATE SET \
        count = broadcast_like.count + 1\
      RETURNING \
        appuser_id, broadcast_id, count\
      /* Retrieve username */\
    ) SELECT \
        au.appuser_id, au.username, lc.broadcast_id, lc.count \
      FROM \
        appuser AS au \
      INNER JOIN \
        like_counter AS lc \
      ON \
        au.appuser_id = lc.appuser_id";
    const insertValues = [broadcastId, userId];
    const pool = await dbConnection.open();
    const res = await pool.query<{
      appuser_id: number;
      username: string;
      broadcast_id: number;
      count: number;
    }>(insertSql, insertValues);

    return {
      likedByUserId: res.rows[0].appuser_id,
      likedByUsername: res.rows[0].username,
      broadcastId: res.rows[0].broadcast_id,
      likeCount: res.rows[0].count,
    };
  },

  getRedisBroadcastStreamKey(userId: number, broadcastId: number) {
    return `broadcaststream:${userId}:${broadcastId}`;
  },
};

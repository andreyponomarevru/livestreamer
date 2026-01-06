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
      this.getRedisBroadcastStreamKey(broadcast.broadcastId),
      stringifiedBroadcast,
    );
  },

  destroy: async function (userId: number, broadcastId: number): Promise<void> {
    const client = await redisConnection.open();
    await client.del(`livebroadcast:${userId}:${broadcastId}`);
  },

  read: async function (broadcastId: number): Promise<BroadcastStream> {
    const client = await redisConnection.open();
    const broadcast = await client.HGETALL(
      this.getRedisBroadcastStreamKey(broadcastId),
    );

    return {
      userId: Number(broadcast.userId),
      broadcastId: Number(broadcast.id),
      listenerPeakCount: Number(broadcast.listenerPeakCount),
      likeCount: Number(broadcast.likeCount),
    };
  },

  isExist: async function (
    userId: number,
    broadcastId: number,
  ): Promise<boolean> {
    const client = await redisConnection.open();
    return Boolean(
      await client.exists(this.getRedisBroadcastStreamKey(broadcastId)),
    );
  },

  updateListenerPeakCount: async function (
    broadcastId: number,
    count: number,
  ): Promise<void> {
    const client = await redisConnection.open();
    await client.HSET(this.getRedisBroadcastStreamKey(broadcastId), {
      listenerPeakCount: `${count}`,
    });
  },

  readListenerPeakCount: async function (broadcastId: number): Promise<number> {
    const client = await redisConnection.open();
    return Number(
      await client.HGET(
        this.getRedisBroadcastStreamKey(broadcastId),
        "listenerPeakCount",
      ),
    );
  },

  createLike: async function (
    likedByUserId: number,
    broadcastId: number,
  ): Promise<{ likesCount: number }> {
    const insertLikeAndSelectTotalLikesCountSql = `
      WITH saved_like AS (
        INSERT INTO 
          broadcast_like (broadcast_id, appuser_id, count) 
        VALUES 
          ($1, $2, 1) 
        ON CONFLICT 
          (broadcast_id, appuser_id) 
        DO UPDATE SET 
          count = broadcast_like.count + 1
      ) 
      SELECT 
        SUM(count) AS count
      FROM 
        broadcast_like  
      WHERE
        broadcast_id = $1
      GROUP by
        broadcast_id`;
    const insertValues = [broadcastId, likedByUserId];
    const pool = await dbConnection.open();
    const res = await pool.query<{ count: number }>(
      insertLikeAndSelectTotalLikesCountSql,
      insertValues,
    );

    return {
      likesCount: res.rows[0].count,
    };
  },

  getRedisBroadcastStreamKey(broadcastId: number) {
    return `stream:${broadcastId}`;
  },
};

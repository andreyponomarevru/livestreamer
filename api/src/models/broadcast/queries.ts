import {
  Broadcast,
  BroadcastUpdate,
  BroadcastDBResponse,
  NewBroadcast,
  BroadcastFilters,
} from "../../types";
import { dbConnection } from "../../config/postgres";

export const broadcastRepo = {
  create: async function (newBroadcast: NewBroadcast): Promise<Broadcast> {
    const sql = `
      INSERT INTO broadcast (
          appuser_id, 
          title, 
          is_visible, 
          start_at, 
          end_at, 
          artwork_url, 
          description,
          listener_peak_count
        )
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        broadcast_id`;
    const values = [
      newBroadcast.userId,
      newBroadcast.title,
      newBroadcast.isVisible,
      newBroadcast.startAt,
      newBroadcast.endAt,
      newBroadcast.artworkUrl,
      newBroadcast.description,
      newBroadcast.listenerPeakCount,
    ];
    const pool = await dbConnection.open();
    const res = await pool.query<{ broadcast_id: number }>(sql, values);

    return {
      ...newBroadcast,
      broadcastId: res.rows[0].broadcast_id,
      likeCount: 0,
    };
  },

  read: async function (broadcastId: number): Promise<Broadcast | null> {
    const sql = "SELECT * FROM view_broadcast WHERE broadcast_id = $1";
    const values = [broadcastId];
    const pool = await dbConnection.open();
    const res = await pool.query<BroadcastDBResponse>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
      return {
        broadcastId: res.rows[0].broadcast_id,
        userId: res.rows[0].appuser_id,
        title: res.rows[0].title,
        startAt: res.rows[0].start_at,
        endAt: res.rows[0].end_at,
        listenerPeakCount: res.rows[0].listener_peak_count,
        isVisible: res.rows[0].is_visible,
        likeCount: Number(res.rows[0].like_count),
        artworkUrl: res.rows[0].artwork_url,
        description: res.rows[0].description,
      };
    } else {
      return null;
    }
  },

  readForUser: async function (
    userId: number,
    broadcastId: number,
  ): Promise<Broadcast | null> {
    const sql =
      "SELECT * FROM view_broadcast WHERE broadcast_id = $1 AND appuser_id = $2";
    const values = [broadcastId, userId];
    const pool = await dbConnection.open();
    const res = await pool.query<BroadcastDBResponse>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
      return {
        broadcastId: res.rows[0].broadcast_id,
        userId: res.rows[0].appuser_id,
        title: res.rows[0].title,
        startAt: res.rows[0].start_at,
        endAt: res.rows[0].end_at,
        listenerPeakCount: res.rows[0].listener_peak_count,
        isVisible: res.rows[0].is_visible,
        likeCount: res.rows[0].like_count,
        artworkUrl: res.rows[0].artwork_url,
        description: res.rows[0].description,
      };
    } else {
      return null;
    }
  },

  readAll: async function (
    { userId, username }: { userId?: number; username?: string },
    filters: BroadcastFilters = { time: null, isVisible: null },
  ): Promise<Broadcast[]> {
    const sql = `
      SELECT 
        * 
      FROM 
        view_broadcast
      WHERE 
        ( appuser_id = $1 OR username = $2 ) AND 
        
        /* If is NULL, return ALL records, ignoring is_visible */
        ( $3::boolean IS NULL OR is_visible = $3::boolean ) AND 
        
        (
          /* Return all records if null */
          ( $4::text ) IS NULL OR
          ( $4::text = 'future'  AND CURRENT_TIMESTAMP < end_at ) OR
          ( $4::text = 'past'    AND CURRENT_TIMESTAMP > end_at ) OR
          ( $4::text = 'current' AND CURRENT_TIMESTAMP BETWEEN start_at AND end_at )
        )
      ORDER BY 
        start_at 
      DESC`;

    const values = [userId, username, filters.isVisible, filters.time];
    const pool = await dbConnection.open();
    const res = await pool.query<BroadcastDBResponse>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
      const broadcasts: Broadcast[] = res.rows.map((row) => {
        return {
          broadcastId: row.broadcast_id,
          userId: row.appuser_id,
          title: row.title,
          startAt: row.start_at,
          endAt: row.end_at,
          artworkUrl: row.artwork_url,
          description: row.description,
          listenerPeakCount: row.listener_peak_count,
          likeCount: Number(row.like_count),
          isVisible: row.is_visible,
        };
      });

      return broadcasts;
    } else {
      return [];
    }
  },

  update: async function (broadcast: BroadcastUpdate): Promise<void> {
    const sql =
      "UPDATE \
        broadcast \
      SET \
        title               = COALESCE($1, title), \
        listener_peak_count = COALESCE($2, listener_peak_count),\
        is_visible          = COALESCE($3, is_visible), \
        start_at            = COALESCE($4, start_at) \
        end_at              = COALESCE($5, end_at) \
        artwork_url         = COALESCE($6, artwork_url) \
        description         = COALESCE($7, description) \
      WHERE \
        broadcast_id = $8 AND\
        appuser_id = $9";
    const values = [
      broadcast.title,
      broadcast.listenerPeakCount,
      broadcast.isVisible,
      broadcast.startAt,
      broadcast.endAt,
      broadcast.artworkUrl,
      broadcast.description,
      broadcast.broadcastId,
      broadcast.userId,
    ];
    const pool = await dbConnection.open();
    await pool.query(sql, values);
  },

  destroy: async function (userId: number, broadcastId: number): Promise<void> {
    const sql =
      "DELETE FROM broadcast WHERE broadcast_id = $1 AND appuser_id = $2";
    const values = [broadcastId, userId];
    const pool = await dbConnection.open();
    await pool.query<{ broadcast_id: number }>(sql, values);
  },

  readLikesCount: async function (
    userId: number,
    broadcastId: number,
  ): Promise<{ likeCount: number }> {
    const pool = await dbConnection.open();
    const selectSql =
      "SELECT like_count FROM view_broadcast WHERE broadcast_id = $1 AND appuser_id = $2";
    const selectValues = [broadcastId, userId];
    const res = await pool.query<{ like_count: number }>(
      selectSql,
      selectValues,
    );
    return { likeCount: res.rows[0].like_count };
  },

  isExist: async function (
    userId: number,
    broadcastId: number,
  ): Promise<boolean> {
    const sql =
      "SELECT 1 FROM view_broadcast WHERE broadcast_id = $1 AND appuser_id = $2";
    const values = [broadcastId, userId];
    const pool = await dbConnection.open();
    const res = await pool.query<{ [key: string]: number }>(sql, values);

    if (res.rowCount !== null && res.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  },
};

import { dbConnection } from "../../config/postgres";
import {
  ChatMsg,
  ChatMsgId,
  ChatMsgLike,
  ChatMsgUnlike,
  NewChatMsg,
  PaginatedItems,
  ReadMsgDBResponse,
  CreateMsgLikeDBResponse,
} from "../../types";
import {
  decodeNextPageCursor,
  encodeNextPageCursor,
} from "../../utils/handle-db-cursors";

export const chatRepo = {
  createMsg: async function (msg: NewChatMsg): Promise<ChatMsg> {
    const insertSql =
      "INSERT INTO chat_message (appuser_id, message) VALUES ($1, $2) RETURNING chat_message_id";
    const insertValues = [msg.userId, msg.message];
    const pool = await dbConnection.open();
    const insertedMsgId = await pool.query<{ chat_message_id: number }>(
      insertSql,
      insertValues,
    );

    const selectSql =
      "SELECT \
        au.username,\
        v_c_h.* \
      FROM \
        view_chat_history AS v_c_h\
      INNER JOIN \
        appuser AS au \
      ON \
        au.appuser_id = v_c_h.appuser_id \
      WHERE \
        v_c_h.chat_message_id = $1";
    const newMsg = await pool.query<ReadMsgDBResponse>(selectSql, [
      insertedMsgId.rows[0].chat_message_id,
    ]);

    return {
      id: newMsg.rows[0].chat_message_id,
      userId: newMsg.rows[0].appuser_id,
      username: newMsg.rows[0].username,
      message: newMsg.rows[0].message,
      createdAt: newMsg.rows[0].created_at,
      likedByUserId: newMsg.rows[0].liked_by_user_id,
    };
  },

  destroyMsg: async function (msg: ChatMsgId): Promise<{
    messageId: number;
    userId: number;
  } | void> {
    const sql =
      "DELETE FROM \
        chat_message \
      WHERE \
        appuser_id = $1 \
      AND \
        chat_message_id = $2\
      RETURNING \
        chat_message_id";
    const values = [msg.userId, msg.messageId];
    const pool = await dbConnection.open();
    const res = await pool.query<{ chat_message_id: number }>(sql, values);

    // If user tries to delete nonexistent message, don't return anything
    if (res.rowCount !== null && res.rowCount > 0) {
      return { userId: msg.userId, messageId: msg.messageId };
    }
  },

  readMsgsPaginated: async function (
    limit: number,
    nextCursor?: string,
  ): Promise<
    PaginatedItems<{
      id: number;
      userId: number;
      username: string;
      createdAt: string;
      message: string;
      likedByUserId: number[];
    }>
  > {
    const sql =
      "SELECT \
        username, v_c_h.*\
      FROM \
        appuser AS usr \
      INNER JOIN \
        view_chat_history AS v_c_h\
      ON \
        usr.appuser_id = v_c_h.appuser_id \
      WHERE\
        /* if user doesn't provide nextCursor, just return the last N rows */\
        ($1::timestamp IS NULL OR $2::integer IS NULL)\
          OR\
        /* if user provides nextCursor, return msgs starting from this cursor*/\
        ($1::timestamp IS NOT NULL AND \
         $2::integer IS NOT NULL AND \
         v_c_h.created_at <= $1 AND \
         chat_message_id <= $2)\
      ORDER BY \
        v_c_h.created_at DESC, \
        chat_message_id DESC\
      LIMIT $3 + 1";

    const { timestampCursor, idCursor } = decodeNextPageCursor(nextCursor);
    const values = [timestampCursor, idCursor, limit];
    const pool = await dbConnection.open();
    const res = await pool.query<ReadMsgDBResponse>(sql, values);

    const items: {
      id: number;
      userId: number;
      username: string;
      createdAt: string;
      message: string;
      likedByUserId: number[];
    }[] = res.rows.map((row) => {
      return {
        id: row.chat_message_id,
        createdAt: row.created_at,
        likedByUserId: row.liked_by_user_id,
        userId: row.appuser_id,
        username: row.username,
        message: row.message,
      };
    });

    // If there IS a new next page, set next cursor. Otherwise nextCursor is set to "null" (in other words, if db response (retrieving limit+1) contains more rows than 'limit' query, set next cursor).
    if (items.length === 0) {
      return { nextCursor: null, items: [] };
    } else if (items.length <= limit) {
      return { nextCursor: null, items: items };
    } else {
      // To handle cases when multiple records have the same timestamp, we create composite cursor (for the last raw) combining record's timestamp and id
      const newNextCursor = encodeNextPageCursor(
        items[items.length - 1].createdAt,
        items[items.length - 1].id,
      );
      const newPage = items.splice(0, items.length - 1);

      return { nextCursor: newNextCursor, items: newPage };
    }
  },

  createMsgLike: async function (msg: {
    messageId: number;
    userId: number;
  }): Promise<ChatMsgLike> {
    const insertSql =
      "INSERT INTO \
        chat_message_like (appuser_id, chat_message_id) \
      VALUES \
        ($1, $2) \
      ON CONFLICT \
        DO NOTHING";
    const insertValues = [msg.userId, msg.messageId];
    const pool = await dbConnection.open();
    await pool.query(insertSql, insertValues);

    const selectSql =
      "SELECT * FROM view_chat_message_likes WHERE chat_message_id = $1";
    const selectValues = [msg.messageId];
    const res = await pool.query<CreateMsgLikeDBResponse>(
      selectSql,
      selectValues,
    );

    return {
      messageId: msg.messageId,
      likedByUserId: msg.userId,
      likedByUserIds: res.rows[0].liked_by_user_id,
    };
  },

  destroyMsgLike: async function (
    msg: ChatMsgId,
  ): Promise<ChatMsgUnlike | void> {
    const deleteSql =
      "DELETE FROM \
        chat_message_like \
      WHERE \
        appuser_id = $1 \
      AND \
        chat_message_id = $2";
    const deleteValues = [msg.userId, msg.messageId];
    const pool = await dbConnection.open();
    await pool.query(deleteSql, deleteValues);

    const selectSql =
      "SELECT * FROM view_chat_message_likes WHERE chat_message_id = $1";
    const selectValues = [msg.messageId];
    const res = await pool.query<CreateMsgLikeDBResponse>(
      selectSql,
      selectValues,
    );

    // If user tries to delete the like of nonexistent message, don't return anything
    if (res.rowCount !== null && res.rowCount > 0) {
      return {
        messageId: msg.messageId,
        unlikedByUserId: msg.userId,
        likedByUserIds: res.rows[0].liked_by_user_id,
      };
    }
  },
};

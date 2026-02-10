import request from "supertest";
import { faker } from "@faker-js/faker";

import { dbConnection } from "../src/config/postgres";
import { authnService } from "../src/services/authn";
import { httpServer } from "../src/http-server";
import { API_URL_PREFIX } from "../src/config/env";
import { NewChatMsg, ReadMsgDBResponse, type NewBroadcast } from "../src/types";

export const PROFILE_IMG_PATH = "uploads/profile-pics/";
export const BROADCAST_IMG_PATH = "uploads/broadcasts/";

export const DATABASE_CONSTRAINTS = {
  maxUsernameLength: 16,
  maxPasswordLength: 50,
  maxDisplayName: 32,
  maxSubscriptionPlanLength: 16,
  maxBroadcastTitle: 70,
};
export const MORE_INFO = { moreInfo: "https://github.com/ponomarevandrey/" };
export const RESPONSE_403 = {
  status: 403,
  statusText: "Forbidden",
  message: "You don't have permission to access this resource",
  ...MORE_INFO,
};
export const RESPONSE_401 = {
  status: 401,
  statusText: "Unauthorized",
  moreInfo: "https://github.com/ponomarevandrey/",
  message: "You must authenticate to access this resource",
};

export const newUser = {
  roleId: 2,
  email: faker.internet.email(),
  displayName: faker.internet
    .displayName()
    .substring(0, DATABASE_CONSTRAINTS.maxDisplayName),
  isEmailConfirmed: true,
  isDeleted: false,
  profilePictureUrl: PROFILE_IMG_PATH + "ava.jpg",
  about: faker.lorem.paragraphs(),
};

export const newBroadcast = {
  artworkUrl: BROADCAST_IMG_PATH + "artwork.jpg",
  description: faker.lorem.paragraphs(),
  listenerPeakCount: faker.number.int({ min: 0, max: 10000 }),
  title: faker.book
    .title()
    .substring(0, DATABASE_CONSTRAINTS.maxBroadcastTitle),
  isVisible: true,
};

type Credentials = { username: string; password: string };

export async function signIn({ username, password }: Credentials) {
  const agent = request.agent(httpServer);
  return agent.post(`${API_URL_PREFIX}/sessions`).send({ username, password });
}

export async function createUser({
  roleId,
  username,
  password,
  email,
  isEmailConfirmed,
  isDeleted,
  emailConfirmationToken,
  passwordResetToken,
  displayName = username,
  websiteUrl = "",
  about = "",
  profilePictureUrl = "/mnt/0/i.jpg",
  subscriptionName = "",
}: {
  roleId: number;
  username: string;
  password: string;
  email: string;
  isEmailConfirmed: boolean;
  isDeleted: boolean;
  emailConfirmationToken?: string;
  passwordResetToken?: string;
  displayName?: string;
  websiteUrl?: string;
  about?: string;
  profilePictureUrl?: string;
  subscriptionName?: string;
}) {
  const passwordHash = await authnService.hashPassword(password);

  const pool = await dbConnection.open();
  const sql = `
      INSERT INTO appuser (
        role_id, 
        username, 
        password_hash, 
        email, 
        is_email_confirmed, 
        is_deleted,
        email_confirmation_token,
        password_reset_token,
        display_name,
        website_url,
        about,
        profile_picture_url,
        subscription_name
      ) 
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      RETURNING *`;

  const res = await pool.query<{
    appuser_id: number;
    role_id: number;
    username: string;
    password_hash: string;
    email: string;
    is_email_confirmed: boolean;
    is_deleted: boolean;
    email_confirmation_token: string | null;
    password_reset_token: string | null;
    display_name: string;
    website_url: string;
    about: string;
    profile_picture_url: string;
    subscription_name: string;
  }>(sql, [
    roleId,
    username,
    passwordHash,
    email,
    isEmailConfirmed,
    isDeleted,
    emailConfirmationToken,
    passwordResetToken,
    displayName,
    websiteUrl,
    about,
    profilePictureUrl,
    subscriptionName,
  ]);

  return res.rows[0];
}

export async function createBroadcast(broadcast: NewBroadcast) {
  const pool = await dbConnection.open();

  const res = await pool.query<{
    broadcast_id: number;
    appuser_id: number;
    title: string;
    is_visible: boolean;
    start_at: number;
    end_at: number;
    artwork_url: string;
    description: string;
    listener_peak_count: number;
  }>(
    `INSERT INTO broadcast (
      appuser_id, 
      title, 
      is_visible, 
      start_at, 
      end_at, 
      artwork_url, 
      description,
      listener_peak_count
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING 
      *`,
    [
      broadcast.userId,
      broadcast.title,
      broadcast.isVisible,
      broadcast.startAt,
      broadcast.endAt,
      broadcast.artworkUrl,
      broadcast.description,
      broadcast.listenerPeakCount,
    ],
  );

  return res.rows[0];
}

export async function createChatMessageForBroadcast(msg: NewChatMsg) {
  const insertSql = `
      INSERT INTO chat_message (
        appuser_id, 
        broadcast_id,
        message
      ) 
      VALUES (
        $1, $2, $3
      ) 
      RETURNING 
        chat_message_id,
        broadcast_id`;
  const pool = await dbConnection.open();
  const insertedMsgId = await pool.query<{ chat_message_id: number }>(
    insertSql,
    [msg.userId, msg.broadcastId, msg.message],
  );

  const selectSql = `
      SELECT
        au.username,
        v_c_h.* 
      FROM 
        view_chat_history AS v_c_h
      INNER JOIN 
        appuser AS au 
      ON 
        au.appuser_id = v_c_h.appuser_id 
      WHERE 
        v_c_h.chat_message_id = $1`;
  const newMsg = await pool.query<ReadMsgDBResponse>(selectSql, [
    insertedMsgId.rows[0].chat_message_id,
  ]);

  return {
    message_id: newMsg.rows[0].chat_message_id,
    broadcast_id: newMsg.rows[0].broadcast_id,
    appuser_id: newMsg.rows[0].appuser_id,
    username: newMsg.rows[0].username,
    message: newMsg.rows[0].message,
    created_at: newMsg.rows[0].created_at,
    liked_by_user_id: newMsg.rows[0].liked_by_user_id,
  };
}

export function generateUrlPath(
  routePattern: string,
  params: Record<string, unknown>,
) {
  let url = routePattern;
  for (const key in params) {
    url = url.replace(`:${key}`, String(params[key]));
  }

  return url;
}

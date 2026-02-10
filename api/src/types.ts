import { Request } from "express";
import WebSocket from "ws";
import { IncomingHttpHeaders } from "http";
import { User } from "./models/user/user";

//
// Web Socket
//

export interface WSClient {
  readonly userId?: number;
  readonly uuid: string;
  readonly broadcastId: number;
  readonly username: string;
  readonly socket: WebSocket;
  readonly profilePictureUrl: string;
}
export type SanitizedWSChatClient = Pick<
  WSClient,
  "uuid" | "username" | "profilePictureUrl"
>;
export type AppState = { isStreamPaused: boolean };
export type WebSocketUUID = { uuid: string };
export type BroadcastStreamWebSocketData = {
  isStreaming: boolean;
  broadcast?: BroadcastStream;
};
export type WSUserMsg<Data> = {
  event: string;
  clientUUID: string;
  username: string;
  data?: Data;
};
export type DeletedWSClient = {
  roomId: number;
  uuid: string;
  userId: number;
  username: string;
};
export type ClientCount = { count: number };
export type WSMsg =
  | AddClientMsg
  | ClientsListMsg
  | StreamStateMsg
  | CreateChatMsg
  | DeleteChatMsg
  | LikeChatMsg
  | UnlikeChatMsg
  | StreamLikeMsg
  | DeleteClientMsg
  | UpdateClientCountMsg;
export type AddClientMsg = {
  event: "chat:new_client";
  data: SanitizedWSChatClient;
};
export type ClientsListMsg = {
  event: "chat:client_list";
  data: SanitizedWSChatClient[];
};
export type StreamStateMsg = {
  event: "stream:state";
  data: BroadcastStreamWebSocketData;
};
export type StreamLikeMsg = { event: "stream:like"; data: SavedBroadcastLike };
export type CreateChatMsg = { event: "chat:created_message"; data: ChatMsg };
export type DeleteChatMsg = {
  event: "chat:deleted_message";
  data: ChatMsgId;
};
export type LikeChatMsg = { event: "chat:liked_message"; data: ChatMsgLike };
export type UnlikeChatMsg = {
  event: "chat:unliked_message";
  data: ChatMsgUnlike;
};
export type DeleteClientMsg = {
  event: "chat:deleted_client";
  data: DeletedWSClient;
};
export type UpdateClientCountMsg = {
  event: "chat:client_count";
  data: ClientCount;
};

//
// API
//

export type BroadcastStream = {
  userId: number;
  broadcastId: number;
  likeCount: number;
  listenerPeakCount: number;
};

export interface UserAccount {
  userId: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  isConfirmed: boolean;
  isDeleted: boolean;
  permissions: Permissions;
}
export type SanitizedUser = Pick<
  User,
  | "uuid"
  | "userId"
  | "email"
  | "username"
  | "permissions"
  | "createdAt"
  | "lastLoginAt"
  | "about"
  | "displayName"
  | "websiteUrl"
  | "profilePictureUrl"
  | "subscriptionName"
  | "isEmailConfirmed"
>;
export interface NewBroadcast {
  userId: number;
  title: string;
  isVisible: boolean;
  artworkUrl: string;
  description: string;
  startAt: string;
  endAt: string;
  listenerPeakCount: number;
}

export type Broadcast = NewBroadcast & {
  broadcastId: number;
  likeCount: number;
};
export type SortedBroadcasts = {
  past: Broadcast[];
  current: Broadcast[];
  future: Broadcast[];
};
export interface BroadcastUpdate {
  userId: number;
  broadcastId: number;
  title?: string;
  listenerPeakCount?: number;
  artworkUrl?: string;
  description?: string;
  isVisible?: boolean;
  startAt?: Date | string;
  endAt?: Date | string;
}
export interface BroadcastDBResponse {
  broadcast_id: number;
  appuser_id: number;
  title: string;
  start_at: string;
  end_at: string;
  listener_peak_count: number;
  artwork_url: string;
  description: string;
  is_visible: boolean;
  like_count: number;
}
export type BroadcastFilters = {
  isVisible?: boolean | null;
  time?: "future" | "past" | "current" | null;
};
export type SavedBroadcastLike = {
  broadcastId: number;
  likedByUserId: number;
  likedByUsername: string;
  likeCount: number;
};
export interface ChatMsg {
  messageId: number;
  broadcastId: number;
  userId: number;
  username: string;
  createdAt: string;
  message: string;
  likedByUserId: number[];
}
export type ChatMsgId = {
  broadcastId: number;
  messageId: number;
  userId: number;
};
export type NewChatMsg = {
  broadcastId: number;
  userId: number;
  message: string;
};
export type ChatMsgLike = {
  broadcastId: number;
  messageId: number;
  likedByUserId: number;
  likedByUserIds: number[];
};
export type ChatMsgUnlike = {
  broadcastId: number;
  messageId: number;
  unlikedByUserId: number;
  likedByUserIds: number[];
};
export type PaginatedItems<T> = {
  nextCursor: string | null;
  items: T[];
};
export type SignUpData = {
  roleId: number;
  email: string;
  username: string;
  password: string;
  isEmailConfirmed: boolean;
};
export type Permissions = { [key: string]: string[] };

//
// Database responses
//

export type ReadMsgDBResponse = {
  broadcast_id: number;
  chat_message_id: number;
  appuser_id: number;
  username: string;
  message: string;
  created_at: string;
  liked_by_user_id: number[];
};
export type CreateMsgLikeDBResponse = {
  chat_message_id: number;
  liked_by_user_id: number[];
};

//
// Extended types
//

export interface CustomRequest extends Request {
  headers: IncomingHttpHeaders & {
    basicauth?: { schema: string; username: string; password: string };
  };
}

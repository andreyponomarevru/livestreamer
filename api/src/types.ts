import { Request } from "express";
import WebSocket from "ws";
import { IncomingHttpHeaders } from "http";

//
// Web Socket
//

export interface WSClient {
  readonly uuid: string;
  readonly id?: number;
  readonly username: string;
  readonly socket: WebSocket;
}
export type SanitizedWSChatClient = { uuid: string; username: string };
export type AppState = { isStreamPaused: boolean };
export type WebSocketUUID = { uuid: string };
export type UnauthenticatedWSClient = { id: string; socket: WebSocket };
export type WSUserMsg<Data> = {
  event: string;
  clientUUID: string;
  username: string;
  data?: Data;
};
export type DeletedWSClient = { uuid: string; id: number; username: string };
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
  data: BroadcastState;
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

export type BroadcastState = {
  isOnline: boolean;
  broadcast?: {
    likeCount: number;
    id: number;
    title: string;
    startAt: string;
    listenerPeakCount: number;
  };
};
export type Bookmark = { userId: number; broadcastId: number };
export interface UserAccount {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLoginAt: string;
  isConfirmed: boolean;
  isDeleted: boolean;
  permissions: Permissions;
}
export interface SanitizedUser {
  uuid: string;
  id: number;
  email: string;
  username: string;
  permissions: Permissions;
}
export interface Schedule {
  id?: number;
  title: string;
  startAt: string;
  endAt: string;
}
export interface BroadcastDraft {
  id: number;
  title: string;
  startAt: string;
  listenerPeakCount: number;
  likeCount: number;
}
export interface NewBroadcast {
  title: string;
  listenerPeakCount: number;
  isVisible?: boolean;
  startAt: string;
}
export interface Broadcast {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
  listenerPeakCount: number;
  downloadUrl: string;
  listenUrl: string;
  likeCount: number;
  isVisible: boolean;
  tracklist: string;
}
export interface BroadcastUpdate {
  id: number;
  title?: string;
  tracklist?: string;
  downloadUrl?: string;
  listenUrl?: string;
  listenerPeakCount?: number;
  isVisible?: boolean;
  endAt?: Date | string;
}
export interface BroadcastDBResponse {
  broadcast_id: number;
  title: string;
  tracklist: string;
  start_at: string;
  end_at: string;
  listener_peak_count: number;
  download_url: string;
  listen_url: string;
  is_visible: boolean;
  like_count: number;
}
export type SavedBroadcastLike = {
  broadcastId: number;
  likedByUserId: number;
  likedByUsername: string;
  likeCount: number;
};
export interface ChatMsg {
  id: number;
  userId: number;
  username: string;
  createdAt: string;
  message: string;
  likedByUserId: number[];
}
export type ChatMsgId = { id: number; userId: number };
export type NewChatMsg = { userId: number; message: string };
export type ChatMsgLike = {
  messageId: number;
  likedByUserId: number;
  likedByUserIds: number[];
};
export type ChatMsgUnlike = {
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

export type ScheduledBroadcastDBResponse = {
  scheduled_broadcast_id: number;
  title: string;
  start_at: Date;
  end_at: Date;
};
export type ReadMsgDBResponse = {
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

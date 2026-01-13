import { RESOURCES, PERMISSIONS } from "./config/constants";

//
// Forms
//

export type SignInForm = { emailOrUsername: string; password: string };
export type RegisterForm = {
  email: string;
  username: string;
  password: string;
};
export type Credentials = {
  password: string;
  username?: string;
  email?: string;
};
export type UserSettings = { username: string };

//
// API
//

export type APIResponseSuccess<T> = { results: T };
export type APIResponseError = {
  status: number;
  message: string;
  moreInfo: string;
};

export type Permissions = {
  [key in (typeof RESOURCES)[number]]?: (typeof PERMISSIONS)[number][];
};
export type APIError = { status: number; moreInfo: string; message: string };

export interface ChatMsg {
  messageId: number;
  broadcastId: number;
  userId: number;
  userUUID: string;
  username: string;
  createdAt: string;
  message: string;
  likedByUserId: number[];
}
export type ScheduledBroadcast = {
  broadcastId: number;
  title: string;
  startAt: string;
  endAt: string;
};
export type Broadcast = {
  title: string;
  startAt: string;
  endAt: string;
  listenerPeakCount: number;
  downloadUrl: string;
  listenUrl: string;
  likeCount: number;
  isVisible: boolean;
  tracklist: string;
};
export type User = {
  uuid?: string;
  userId: number;
  email: string;
  username: string;
  permissions: Permissions;
  createdAt?: string;
  lastLoginAt?: string | null;
  isEmailConfirmed?: boolean;
  isDeleted?: boolean;
  profilePictureUrl: string;
};
export interface BroadcastDraft {
  broadcastId: number;
  title: string;
  startAt: string;
  listenerPeakCount: number;
  likeCount: number;
}
export type SavedBroadcastLike = {
  broadcastId: number;
  likedByUserId: number;
  likedByUsername: string;
  likeCount: number;
  likedByUserUUID: string;
};
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
export type ChatMsgId = { id: number; userId: number };
export type NewChatMsg = { userId: number; message: string };
export type BroadcastState = {
  isOnline: boolean;
  broadcast?: {
    broadcastId: number;
    likeCount: number;
    title: string;
    startAt: string;
    listenerPeakCount: number;
  };
};

//
// Web Socket
//

export type SanitizedWSChatClient = {
  broadcastId: number;
  uuid: string;
  username: string;
};
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
// Client list events (currently supported by backend but not implemented on
// frontend)
export type AddClientMsg = {
  event: "chat:new_client";
  data: SanitizedWSChatClient;
};
export type DeleteClientMsg = {
  event: "chat:deleted_client";
  data: DeletedWSClient;
};
export type ClientsListMsg = {
  event: "chat:client_list";
  data: SanitizedWSChatClient[];
};

// Chat events
export type UpdateClientCountMsg = {
  event: "chat:client_count";
  data: ClientCount;
};
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

// Stream events
export type StreamStateMsg = {
  event: "stream:state";
  data: BroadcastState;
};
export type StreamLikeMsg = { event: "stream:like"; data: SavedBroadcastLike };

//

export type WSMsgEventName = WSMsg["event"];
export type WSMsgPayload = WSMsg["data"];
export type DispatchEvent = {
  socket: WebSocket;
  event: WSMsgEventName;
  msg: WSMsgPayload;
};

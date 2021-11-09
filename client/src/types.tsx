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

//
// API
//

export type Permissions = {
  [key in typeof RESOURCES[number]]?: typeof PERMISSIONS[number][];
};
export type APIError = {
  status: number;
  moreInfo: string;
  message: string;
};
export type ScheduledBroadcastResponse = { results: ScheduledBroadcast[] };
export type BroadcastResponse = { results: Broadcast[] };
export type UserResponse = { results: User };
export type UsersResponse = { results: User[] };
export type ChatMessageResponse = { results: ChatMsg };
export type ChatMsgsPageResponse = {
  results: { nextCursor: string | null; messages: ChatMsg[] };
};

export interface ChatMsg {
  id: number;
  userId: number;
  username: string;
  createdAt: string;
  message: string;
  likedByUserId: number[];
  userUUID: string;
}
export type ScheduledBroadcast = {
  id: number;
  title: string;
  startAt: string;
  endAt: string;
};
export type Broadcast = {
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
};
export type User = {
  uuid?: string;
  id: number;
  email: string;
  username: string;
  permissions: Permissions;
};
export interface BroadcastDraft {
  id: number;
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
    likeCount: number;
    id: number;
    title: string;
    startAt: string;
    listenerPeakCount: number;
  };
};

//
// Web Socket
//

export interface WSClient {
  readonly uuid: string;
  readonly id?: number;
  readonly username: string;
  readonly socket: WebSocket;
  sanitized: { uuid: string; username: string };
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

export type WSMsgEvent = WSMsg["event"];
export type WSMsgPayload = WSMsg["data"];
export type DispatchEvent = {
  socket: WebSocket;
  event: WSMsgEvent;
  msg: WSMsgPayload;
};

// Requests/responses

export type SignUpRes = {
  email: string;
  username: string;
  isConfirmed: true;
  permissions: Permissions;
};

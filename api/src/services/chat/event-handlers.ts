import { sanitizeWSClient, wsService } from "../ws";
import {
  SanitizedWSChatClient,
  ClientCount,
  WSClient,
  ChatMsg,
  ChatMsgId,
  ChatMsgLike,
  ChatMsgUnlike,
  DeletedWSClient,
} from "../../types";

export function onCreateChatMsg(event: ChatMsg & { userUUID: string }): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:created_message", data: event },
    senderUUID: event.userUUID,
    broadcastId: event.broadcastId,
  });
}

export function onDestroyChatMsg(
  event: ChatMsgId & { userUUID: string },
): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:deleted_message", data: event },
    senderUUID: event.userUUID,
    broadcastId: event.broadcastId,
  });
}

export function onLikeChatMsg(
  event: ChatMsgLike & { likedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:liked_message", data: event },
    senderUUID: event.likedByUserUUID,
    broadcastId: event.broadcastId,
  });
}

export function onUnlikeChatMsg(
  event: ChatMsgUnlike & { unlikedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:unliked_message", data: event },
    senderUUID: event.unlikedByUserUUID,
    broadcastId: event.broadcastId,
  });
}

export function onChatStart(event: WSClient) {
  const clients = wsService.clientStore.getSanitizedClients(event.broadcastId);
  wsService.send({
    message: { event: "chat:client_list", data: clients },
    socket: event.socket,
  });

  const count = wsService.clientStore.getClientsCount(event.broadcastId) || 0;

  wsService.send<ClientCount>({
    message: { event: "chat:client_count", data: { count } },
    socket: event.socket,
  });
}

export function onAddClient(client: WSClient): void {
  wsService.sendToAll<SanitizedWSChatClient>({
    broadcastId: client.broadcastId,
    message: { event: "chat:new_client", data: sanitizeWSClient(client) },
  });
}

export function onDeleteClient(event: DeletedWSClient): void {
  wsService.sendToAll<DeletedWSClient>({
    broadcastId: event.broadcastId,
    message: { event: "chat:deleted_client", data: event },
  });
}

export function onUpdateClientCount(event: {
  broadcastId: number;
  count: number;
}): void {
  wsService.sendToAll<ClientCount>({
    broadcastId: event.broadcastId,
    message: { event: "chat:client_count", data: { count: event.count } },
  });
}

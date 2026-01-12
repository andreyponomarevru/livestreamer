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
import { streamService } from "../stream";

export function onCreateChatMsg(event: ChatMsg & { userUUID: string }): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:created_message", data: event },
    senderUUID: event.userUUID,
    roomId: event.broadcastId,
  });
}

export function onDestroyChatMsg(
  event: ChatMsgId & { userUUID: string },
): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:deleted_message", data: event },
    senderUUID: event.userUUID,
    roomId: event.broadcastId,
  });
}

export function onLikeChatMsg(
  event: ChatMsgLike & { likedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:liked_message", data: event },
    senderUUID: event.likedByUserUUID,
    roomId: event.broadcastId,
  });
}

export function onUnlikeChatMsg(
  event: ChatMsgUnlike & { unlikedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender({
    message: { event: "chat:unliked_message", data: event },
    senderUUID: event.unlikedByUserUUID,
    roomId: event.broadcastId,
  });
}

export async function onChatStart(event: WSClient) {
  const clients = wsService.clientStore.getSanitizedClients(event.broadcastId);
  wsService.send({
    message: { event: "chat:client_list", data: clients },
    socket: event.socket,
  });

  const streamState = await streamService.readBroadcastStreamState(
    event.broadcastId,
  );
  wsService.send({
    message: { event: "stream:state", data: streamState },
    socket: event.socket,
  });
}

export function onAddClient(client: WSClient): void {
  wsService.sendToAll<SanitizedWSChatClient>({
    roomId: client.broadcastId,
    message: { event: "chat:new_client", data: sanitizeWSClient(client) },
  });

  wsService.sendToAll<SanitizedWSChatClient>({
    roomId: client.broadcastId,
    message: {
      event: "chat:client_count",
      data: {
        count: wsService.clientStore.getClientsCount(client.broadcastId) || 0,
      },
    },
  });
}

export function onDeleteClient(event: DeletedWSClient): void {
  wsService.sendToAll<DeletedWSClient>({
    roomId: event.roomId,
    message: { event: "chat:deleted_client", data: event },
  });

  wsService.sendToAll<SanitizedWSChatClient>({
    roomId: event.roomId,
    message: {
      event: "chat:client_count",
      data: {
        count: wsService.clientStore.getClientsCount(event.roomId) || 0,
      },
    },
  });
}

export function onUpdateClientCount(event: {
  roomId: number;
  count: number;
}): void {
  wsService.sendToAll<ClientCount>({
    roomId: event.roomId,
    message: { event: "chat:client_count", data: { count: event.count } },
  });
}

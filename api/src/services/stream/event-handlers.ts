import { wsService } from "../ws";
import {
  type SavedBroadcastLike,
  type WSClient,
  type BroadcastStreamWebSocketData,
  type Broadcast,
} from "../../types";

export function onStreamLike(
  like: SavedBroadcastLike & { likedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender(
    { event: "stream:like", data: like },
    { senderUUID: like.likedByUserUUID },
    wsService.clientStore.clients,
  );
}

export function onStreamStart(broadcast: Broadcast): void {
  wsService.sendToAll(
    { event: "stream:state", data: { isStreaming: true, broadcast } },
    wsService.clientStore.clients,
  );
}

export function onStreamEnd(): void {
  wsService.sendToAll(
    { event: "stream:state", data: { isStreaming: false } },
    wsService.clientStore.clients,
  );
}

export function sendBroadcastState(
  reciever: WSClient,
  broadcastState: BroadcastStreamWebSocketData,
): void {
  wsService.send({ event: "stream:state", data: broadcastState }, reciever);
}

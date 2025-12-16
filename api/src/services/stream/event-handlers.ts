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
  wsService.sendToAllExceptSender({
    broadcastId: like.broadcastId,
    senderUUID: like.likedByUserUUID,
    message: { event: "stream:like", data: like },
  });
}

export function onStreamStart(broadcast: Broadcast): void {
  wsService.sendToAll({
    broadcastId: broadcast.broadcastId,
    message: {
      event: "stream:state",
      data: { isStreaming: true, broadcast },
    },
  });
}

export function onStreamEnd(broadcastId: number): void {
  wsService.sendToAll({
    broadcastId,
    message: { event: "stream:state", data: { isStreaming: false } },
  });
}

export function sendBroadcastState(
  reciever: Pick<WSClient, "socket">,
  broadcastState: BroadcastStreamWebSocketData,
): void {
  wsService.send({
    message: { event: "stream:state", data: broadcastState },
    socket: reciever.socket,
  });
}

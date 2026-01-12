import { wsService } from "../ws";
import { type SavedBroadcastLike, type Broadcast } from "../../types";

export function onStreamLike(
  like: SavedBroadcastLike & { likedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender({
    roomId: like.broadcastId,
    senderUUID: like.likedByUserUUID,
    message: { event: "stream:like", data: like },
  });
}

export function onStreamStart(broadcast: Broadcast): void {
  wsService.sendToAll({
    roomId: broadcast.broadcastId,
    message: {
      event: "stream:state",
      data: { isStreaming: true, broadcast },
    },
  });
}

export function onStreamEnd(roomId: number): void {
  wsService.sendToAll({
    roomId,
    message: { event: "stream:state", data: { isStreaming: false } },
  });
}

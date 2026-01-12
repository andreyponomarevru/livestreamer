import { wsService } from "./service";
import { logger } from "../../config/logger";
import { WSChatClient } from "./ws-client";

export async function onConnection(wsClient: WSChatClient): Promise<void> {
  wsClient.socket.on("close", () => {
    wsService.clientStore.deleteClient(wsClient.uuid, wsClient.broadcastId);
  });

  wsService.clientStore.addClient(wsClient);
}

export function onClose(): void {
  logger.info(`${__filename}: WebSocket Server closed.`);
}

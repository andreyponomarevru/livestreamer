import { wsService } from "./service";
import { WSClient } from "../../types";
import { logger } from "../../config/logger";
import { sendBroadcastState, streamService } from "../stream";

export async function onConnection(
  wsClient: WSClient,
  req: unknown,
  params: unknown,
): Promise<void> {
  wsClient.socket.on("close", () =>
    wsService.clientStore.deleteClient(wsClient.uuid, wsClient.broadcastId),
  );

  const state = await streamService.readBroadcastStreamState(
    wsClient.broadcastId,
  );
  sendBroadcastState(wsClient, state);

  wsService.clientStore.addClient(wsClient);
}

export function onClose(): void {
  logger.info(`${__filename}: WebSocket Server closed, bye.`);
}

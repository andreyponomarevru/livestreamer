import { wsService } from "./service";
import { WSClient } from "../../types";
import { logger } from "../../config/logger";
import { sendBroadcastState, streamService } from "../stream";

export async function onConnection(client: WSClient): Promise<void> {
  client.socket.on("close", () =>
    wsService.clientStore.deleteClient(client.uuid),
  );
  sendBroadcastState(client, await streamService.readBroadcastState());
  wsService.clientStore.addClient(client);
}

export function onClose(): void {
  logger.info(`${__filename}: WebSocket Server closed, bye.`);
}

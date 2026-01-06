/* eslint-disable @typescript-eslint/no-unused-vars */

import EventEmitter from "events";

import { WebSocket } from "ws";

import { STATS_MSG_TIME_INTERVAL } from "../../config/ws-server";
import { DeletedWSClient, SanitizedWSChatClient, WSClient } from "../../types";
import { Scheduler } from "./scheduler";
import { logger } from "../../config/logger";
import { sanitizeWSClient } from "./sanitize-ws-client";

type Room = Map<string, WSClient>;
type Store = Map<number, Room>;

class WSClientStore extends EventEmitter {
  private _store: Store;
  private statsUpdatesScheduler: Scheduler;

  constructor(statsUpdatesScheduler: Scheduler) {
    super();
    this._store = new Map();
    this.statsUpdatesScheduler = statsUpdatesScheduler;
  }

  addClient(client: WSClient): void {
    if (!this._store.has(client.broadcastId)) {
      this._store.set(client.broadcastId, new Map());
    }
    this._store.get(client.broadcastId)?.set(client.uuid, client);

    this.scheduleStatsUpdates(client.broadcastId);
    this.emit("add_client", client);

    logger.debug(
      `${__filename} new WS client is added to broadcast ${client.broadcastId}`,
    );
  }

  closeSocket(uuid: string) {
    let found = false;

    for (const [broadcastId, clientsMap] of this._store.entries()) {
      if (clientsMap.has(uuid)) {
        const client = clientsMap.get(uuid);
        if (client) client.socket.close();
        found = true;
      }

      if (found) break;
    }

    if (!found) {
      logger.error(`closeSocket called for UUID ${uuid}, but client not found`);
    }
  }

  deleteClient(uuid: string, broadcastId: number): void {
    const room = this._store.get(broadcastId);
    const client = room?.get(uuid);

    if (client) {
      this.emit("delete_client", {
        broadcastId,
        uuid,
        userId: client.userId,
        username: client.username,
      } as DeletedWSClient);
    }

    room?.delete(uuid);

    if (room?.size === 0) {
      this._store.delete(broadcastId);
      // To avoid memory leak, when all users left the chat, delete the timer.
      this.statsUpdatesScheduler.stop(broadcastId);
    }

    logger.debug(`${__filename} WS client deleted`);
  }

  private scheduleStatsUpdates(broadcastId: number): void {
    const clientsCount = this.getClientsCount(broadcastId);
    const isRoomTimerStarted =
      this.statsUpdatesScheduler.timerIds.get(broadcastId);

    logger.debug(`[scheduleStatsUpdates] clientsCount: ${clientsCount}`);
    // To avoid memory leaks, start timer only once, when the very first client connects. We will reuse this timer for all other clients, instead of creating a new timer per client.
    if (clientsCount === 1 && !isRoomTimerStarted) {
      logger.debug("Start WS Scheduler");

      const emitUpdateClientCountEvent = () => {
        this.emit("update_client_count", { broadcastId, count: clientsCount });
        logger.debug(`[update_client_count] clientsCount: ${clientsCount}`);
      };

      this.statsUpdatesScheduler.start(
        broadcastId,
        STATS_MSG_TIME_INTERVAL,
        emitUpdateClientCountEvent,
      );
    }
  }

  getClientsCount(broadcastId: number): number | undefined {
    return this._store.get(broadcastId)?.size;
  }

  getClientSocket(broadcastId: number, uuid: string): WebSocket | undefined {
    return this._store.get(broadcastId)?.get(uuid)?.socket;
  }

  getClientsSockets(
    broadcastId: number,
  ): { uuid: string; socket: WebSocket }[] {
    return Array.from(this._store.get(broadcastId) || [], ([uuid, client]) => ({
      uuid,
      socket: client.socket,
    }));
  }

  getSanitizedClients(broadcastId: number): SanitizedWSChatClient[] {
    return Array.from(this._store.get(broadcastId) || [], ([uuid, client]) =>
      sanitizeWSClient(client),
    );
  }

  getClient(broadcastId: number, uuid: string): WSClient | undefined {
    return this._store.get(broadcastId)?.get(uuid);
  }
}

export { WSClientStore };

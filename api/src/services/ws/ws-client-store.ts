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
    const roomId = client.broadcastId;

    if (!this._store.has(roomId)) {
      this._store.set(roomId, new Map());
    }
    this._store.get(roomId)?.set(client.uuid, client);

    this.emit("add_client", client);
    this.scheduleStatsUpdates(roomId);

    logger.debug(
      `${__filename} new WS client is added to room/broadcast ${roomId}`,
    );
  }

  closeSocket(uuid: string) {
    let found = false;

    for (const [roomId, clientsMap] of this._store.entries()) {
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

  deleteClient(uuid: string, roomId: number): void {
    const room = this._store.get(roomId);
    const client = room?.get(uuid);

    room?.delete(uuid);

    if (client) {
      this.emit("delete_client", {
        roomId,
        uuid,
        userId: client.userId,
        username: client.username,
      } as DeletedWSClient);
    }

    if (room?.size === 0) {
      this._store.delete(roomId);
      // To avoid memory leak, when all users left the chat, delete the timer.
      this.statsUpdatesScheduler.stop(roomId);
    }

    logger.debug(`${__filename} WS client deleted`);
  }

  private scheduleStatsUpdates(roomId: number): void {
    const clientsCount = this.getClientsCount(roomId);
    const isRoomTimerStarted = this.statsUpdatesScheduler.timerIds.get(roomId);

    logger.debug(`[scheduleStatsUpdates] clientsCount: ${clientsCount}`);
    // To avoid memory leaks, start timer only once, when the very first client connects. We will reuse this timer for all other clients, instead of creating a new timer per client.
    if (clientsCount === 1 && !isRoomTimerStarted) {
      logger.debug("Start WS Scheduler");

      const emitUpdateClientCountEvent = () => {
        this.emit("update_client_count", {
          roomId,
          count: this.getClientsCount(roomId),
        });
        logger.debug(
          `[update_client_count] clientsCount: ${this.getClientsCount(roomId)}`,
        );
      };

      this.statsUpdatesScheduler.start(
        roomId,
        STATS_MSG_TIME_INTERVAL,
        emitUpdateClientCountEvent,
      );
    }
  }

  getClientsCount(roomId: number): number | undefined {
    return this._store.get(roomId)?.size;
  }

  getClientSocket(roomId: number, uuid: string): WebSocket | undefined {
    return this._store.get(roomId)?.get(uuid)?.socket;
  }

  getClientsSockets(roomId: number): { uuid: string; socket: WebSocket }[] {
    return Array.from(this._store.get(roomId) || [], ([uuid, client]) => ({
      uuid,
      socket: client.socket,
    }));
  }

  getSanitizedClients(roomId: number): SanitizedWSChatClient[] {
    return Array.from(this._store.get(roomId) || [], ([uuid, client]) =>
      sanitizeWSClient(client),
    );
  }

  getClient(roomId: number, uuid: string): WSClient | undefined {
    return this._store.get(roomId)?.get(uuid);
  }
}

export { WSClientStore };

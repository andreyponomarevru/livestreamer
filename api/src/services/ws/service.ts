import util from "util";

import { WebSocket } from "ws";

import { WSClientStore } from "./ws-client-store";
import { IntervalScheduler } from "./scheduler";
import { logger } from "../../config/logger";
import { type WSMsg, type WSUserMsg } from "../../types";

type Message<M> = WSMsg | WSUserMsg<M>;
type MsgToAllExceptSender<M> = {
  message: Message<M>;
  senderUUID: string;
  broadcastId: number;
};
type MsgToSingleUser<M> = {
  message: Message<M>;
  socket: WebSocket;
};
type MsgToAll<M> = {
  message: WSMsg | WSUserMsg<M>;
  broadcastId: number;
};

export const wsService = {
  clientStore: new WSClientStore(new IntervalScheduler()),

  send: function <M>({ message, socket }: MsgToSingleUser<M>): void {
    socket.send(JSON.stringify(message));

    logger.debug(`[send] ${util.inspect(message)}`);
  },

  sendToAll: function <M>({ message, broadcastId }: MsgToAll<M>): void {
    const recievers = this.clientStore.getClientsSockets(broadcastId);

    for (const reciever of recievers) {
      reciever.socket.send(JSON.stringify(message));
    }
  },

  sendToAllExceptSender: function <M>(msg: MsgToAllExceptSender<M>): void {
    const recievers = this.clientStore.getClientsSockets(msg.broadcastId);

    for (const reciever of recievers) {
      if (msg.senderUUID !== reciever.uuid) {
        reciever.socket.send(JSON.stringify(msg.message));
      }
    }
  },
};

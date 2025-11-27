import WebSocket from "ws";

import { WSClient } from "../../types";

class WSChatClient implements WSClient {
  readonly userId?: number;
  readonly uuid: string;
  readonly username: string;
  readonly socket: WebSocket;

  constructor(client: {
    uuid: string;
    userId?: number;
    username: string;
    socket: WebSocket;
  }) {
    this.uuid = client.uuid;
    this.userId = client.userId;
    this.username = client.username;
    this.socket = client.socket;
  }
}

export { WSChatClient };

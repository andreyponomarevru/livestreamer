import WebSocket from "ws";

import { WSClient } from "../../types";

class WSChatClient implements WSClient {
  readonly userId?: number;
  readonly uuid: string;
  readonly broadcastId: number;
  readonly username: string;
  readonly profilePictureUrl: string;
  readonly socket: WebSocket;

  constructor(client: {
    uuid: string;
    userId?: number;
    broadcastId: number;
    username: string;
    profilePictureUrl: string;
    socket: WebSocket;
  }) {
    this.uuid = client.uuid;
    this.userId = client.userId;
    this.broadcastId = client.broadcastId;
    this.username = client.username;
    this.profilePictureUrl = client.profilePictureUrl;
    this.socket = client.socket;
  }
}

export { WSChatClient };

import React from "react";
import ReconnectingWebSocket, { type CloseEvent } from "reconnecting-websocket";

import { type WSMsgEvent, type WSMsgPayload } from "../../types";

type Callback = React.Dispatch<React.SetStateAction<any>>;
export interface IWebSocketClient {
  bindToServerEvents: (eventName: WSMsgEvent, callback: Callback) => this;
  unbindFromServerEvents: (eventName: WSMsgEvent, callback: Callback) => void;
}

export class WebSocketClient implements IWebSocketClient {
  private socket?: ReconnectingWebSocket;
  private callbacks?: { [key in WSMsgEvent]: Callback[] };

  constructor(url: string) {
    this.connect(url);
  }

  private connect(url: string) {
    this.socket = new ReconnectingWebSocket(url);
    this.callbacks = {} as { [key in WSMsgEvent]: Callback[] };

    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    console.debug("[ws] [onopen]");
  }

  private onMessage(event: MessageEvent) {
    try {
      if (!event.data) {
        console.warn(
          "[ws] [onMessage] Empty message. No events will be dispatched"
        );
        return;
      }

      const { event: eventName, data: eventData } = JSON.parse(event.data);

      this.dispatch([eventName, eventData]);
    } catch (err) {
      console.error("[ws] Error parsing event.data", err);
    }
  }

  private onClose(event: CloseEvent) {
    if (event.wasClean) {
      const { code, reason } = event;
      console.debug(
        `[ws] [onclose] Connection closed cleanly, code ${code} reason=${reason}`
      );
    } else {
      console.error(`[ws] [onclose] Connection died`);
    }
  }

  private dispatch([eventName, eventData]: [WSMsgEvent, WSMsgPayload]) {
    const callbacksChain = this.callbacks?.[eventName];

    if (callbacksChain === undefined) return;
    for (let i = 0; i < callbacksChain.length; i++) {
      console.debug(
        "[ws] Executes callback in a chain, providing it with event data: ",
        eventData
      );
      callbacksChain[i](eventData);
    }
  }

  bindToServerEvents(eventName: WSMsgEvent, callback: any): this {
    if (this.callbacks) {
      this.callbacks[eventName] = this.callbacks[eventName] || [];
      this.callbacks[eventName].push(callback);
      console.debug("[ws] [bindToServerEvents]", this.callbacks);
    }
    // make chainable
    return this;
  }

  unbindFromServerEvents(eventName: WSMsgEvent, callback: any) {
    if (this.callbacks && !this.callbacks[eventName]) {
      console.debug(
        "[ws] [unbindFromServerEvents] Can't unbind function which was not bound"
      );
      return;
    }

    if (this.callbacks) {
      this.callbacks[eventName] = this.callbacks[eventName].filter((f) => {
        return f !== callback;
      });
    }
  }

  send(eventName: WSMsgEvent, eventData: WSMsgPayload) {
    const payload = JSON.stringify([eventName, eventData]);
    this.socket?.send(payload);
    return this;
  }
}

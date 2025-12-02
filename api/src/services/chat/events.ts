import EventEmitter from "events";
import { ChatMsg, ChatMsgId, ChatMsgLike, ChatMsgUnlike } from "../../types";

export class ChatEmitter extends EventEmitter {
  createChatMsg(msg: ChatMsg & { userUUID: string }): void {
    this.emit("create_message", msg);
  }

  destroyChatMsg(msg: {
    broadcastId: number;
    messageId: number;
    userUUID: string;
  }): void {
    this.emit("delete_message", msg);
  }

  likeChatMsg(like: ChatMsgLike & { likedByUserUUID: string }): void {
    this.emit("like_message", like);
  }

  unlikeChatMsg(unlike: ChatMsgUnlike & { unlikedByUserUUID: string }): void {
    this.emit("unlike_message", unlike);
  }
}

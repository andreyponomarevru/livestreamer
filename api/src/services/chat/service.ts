import { chatRepo } from "../../models/chat/queries";
import { ChatEmitter } from "./events";
import { ChatMsgId, NewChatMsg, ChatMsg } from "../../types";

export const chatService = {
  events: new ChatEmitter(),

  createMsg: async function (
    msg: NewChatMsg & { userUUID: string },
  ): Promise<ChatMsg & { userUUID: string }> {
    const savedMsg = await chatRepo.createMsg(msg);
    if (savedMsg)
      this.events.createChatMsg({ ...savedMsg, userUUID: msg.userUUID });
    return { ...savedMsg, userUUID: msg.userUUID };
  },

  destroyMsg: async function (
    msg: ChatMsgId & { userUUID: string },
  ): Promise<void> {
    const destroyedMsg = await chatRepo.destroyOwnMsg(msg);
    if (destroyedMsg) {
      this.events.destroyChatMsg({ ...destroyedMsg, userUUID: msg.userUUID });
    }
  },

  destroyAnyMsg: async function (msg: {
    broadcastId: number;
    messageId: number;
    userUUID: string;
  }): Promise<void> {
    const destroyedMsg = await chatRepo.destroyAnyMsg(msg);
    if (destroyedMsg) {
      this.events.destroyChatMsg({ ...destroyedMsg, userUUID: msg.userUUID });
    }
  },

  readMsgsPaginated: async function ({
    broadcastId,
    limit,
    nextCursor,
  }: {
    broadcastId: number;
    limit: number;
    nextCursor?: string;
  }): Promise<{
    nextCursor: string | null;
    messages: {
      messageId: number;
      broadcastId: number;
      userId: number;
      username: string;
      createdAt: string;
      message: string;
      likedByUserId: number[];
    }[];
  }> {
    const page = await chatRepo.readMsgsPaginated({
      broadcastId,
      limit,
      nextCursor,
    });
    return {
      nextCursor: page.nextCursor,
      messages: page.items,
    };
  },

  likeMsg: async function (
    msg: ChatMsgId & { userUUID: string },
  ): Promise<void> {
    const like = await chatRepo.createMsgLike(msg);
    if (like)
      this.events.likeChatMsg({ ...like, likedByUserUUID: msg.userUUID });
  },

  unlikeMsg: async function (
    unlike: ChatMsgId & { userUUID: string },
  ): Promise<void> {
    const msg = await chatRepo.destroyMsgLike(unlike);
    if (msg)
      this.events.unlikeChatMsg({ ...msg, unlikedByUserUUID: unlike.userUUID });
  },
};

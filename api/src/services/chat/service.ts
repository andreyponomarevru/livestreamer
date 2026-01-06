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

  readMsgsPaginated: async function (params: {
    broadcastId: number;
    limit: number;
    nextCursor?: string;
  }): Promise<{
    nextCursor: string | null;
    messages: ChatMsg[];
  }> {
    const page = await chatRepo.readMsgsPaginated(params);

    return {
      nextCursor: page.nextCursor,
      messages: page.items,
    };
  },

  likeMsg: async function (
    like: ChatMsgId & { userUUID: string },
  ): Promise<void> {
    const savedLike = await chatRepo.createMsgLike(like);
    if (savedLike) {
      this.events.likeChatMsg({
        broadcastId: like.broadcastId,
        ...savedLike,
        likedByUserUUID: like.userUUID,
      });
    }
  },

  unlikeMsg: async function (
    unlike: ChatMsgId & { userUUID: string },
  ): Promise<void> {
    const updatedLikes = await chatRepo.destroyMsgLike(unlike);
    if (updatedLikes)
      this.events.unlikeChatMsg({
        broadcastId: unlike.broadcastId,
        ...updatedLikes,
        unlikedByUserUUID: unlike.userUUID,
      });
  },
};

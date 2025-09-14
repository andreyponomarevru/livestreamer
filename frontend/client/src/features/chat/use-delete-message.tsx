import * as React from "react";

import { hasPermission } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../current-user/current-user-slice";
import { useDeleteMessageMutation } from "./chat-slice";

function useDeleteMessage() {
  const [deleteMessage, { isSuccess, isError }] = useDeleteMessageMutation();

  async function handleDeleteMessage(msg: {
    messageId: number;
    userId?: number;
  }) {
    const hasPermissionToDeleteAnyMsg = hasPermission(
      { resource: "any_chat_message", action: "delete" },
      user
    );
    const hasPermissionToDeleteOwnMsg = hasPermission(
      { resource: "user_own_chat_message", action: "delete" },
      user
    );

    if (hasPermissionToDeleteAnyMsg) {
      await deleteMessage({
        messageId: msg.messageId,
        userId: msg.userId,
      }).unwrap();
      setDeletedMessageId(msg.messageId);
    } else if (hasPermissionToDeleteOwnMsg) {
      await deleteMessage({ messageId: msg.messageId }).unwrap();
      setDeletedMessageId(msg.messageId);
    }
  }

  const user = useAppSelector(selectCurrentUserProfile);
  const dispatch = useAppDispatch();

  const [deletedMessageId, setDeletedMessageId] = React.useState<number>();

  React.useEffect(() => {
    if (isSuccess && deletedMessageId) {
      deleteMessage({ messageId: deletedMessageId });
    }
  }, [isSuccess, isError, deletedMessageId, deleteMessage]);

  return handleDeleteMessage;
}

export { useDeleteMessage };

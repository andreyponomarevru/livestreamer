import * as React from "react";

import { ChatControls } from "../chat-controls";
import { MsgsList } from "../messages-list";
import { useCreateMessageWSEvent } from "../../../ws/hooks/use-create-message-ws-event";
import { useDeleteMessageWSEvent } from "../../../ws/hooks/use-delete-message-ws-event";
import { sortMessages } from "../../../../utils";
import {
  useDeleteMessageMutation,
  useGetChatHistoryQuery,
  usePostNewMessageMutation,
} from "../../../chat/chat-slice";
import { LinkBtn } from "../../../ui/btn";
import { CrowdIcon } from "../../../ui/icons";
import { PATHS } from "../../../../config/constants";
import { Loader } from "../../../ui/loader/loader-component";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../auth";
import { Message } from "../../../ui/message/message-component";
import { EmptyChat } from "../../../empty-placeholders/empty-chat";

import styles from "./chat.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function Chat(props: Props) {
  const user = useAppSelector(selectCurrentUserProfile); // TODO: get from Redux

  const {
    data: paginatedMsgs,
    isLoading: isGetChatHistoryLoading,
    isSuccess: isGetChatHistorySuccess,
    isError: isGetChatHistoryError,
    isFetching: isGetChatHistoryFetching,
  } = useGetChatHistoryQuery();

  const sortedMessages = React.useMemo(() => {
    const sortedMessages = paginatedMsgs?.messages.slice();
    sortedMessages?.sort(sortMessages);
    return sortedMessages;
  }, [paginatedMsgs]);

  //

  const messagesEndRef = React.useRef<null | HTMLLIElement>(null);
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [sortedMessages]);

  const [postMessage] = usePostNewMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  //

  useCreateMessageWSEvent(postMessage);
  useDeleteMessageWSEvent(deleteMessage);

  return (
    <div className={styles["chat"]}>
      {!sortedMessages && isGetChatHistorySuccess && <EmptyChat />}

      {isGetChatHistoryLoading && <Loader />}

      {isGetChatHistoryError && (
        <Message type="warning">
          Oops! Something went wrong. Please try again later.
        </Message>
      )}

      {isGetChatHistorySuccess && (
        <MsgsList
          className={styles["chat__content"]}
          messages={sortedMessages}
          handleDeleteMessage={deleteMessage}
        />
      )}

      {isGetChatHistorySuccess ? (
        user ? (
          <ChatControls
            className={styles["chat__controls"]}
            isDisabled={isGetChatHistoryFetching}
            isStreamOnline={props.isStreamOnline}
          />
        ) : (
          <LinkBtn
            theme="quaternary"
            className={`${styles["chat__join-chat-btn"]} ${styles["chat__controls"]}`}
            href={PATHS.signIn}
          >
            <CrowdIcon className={styles["chat__join-chat-btn-icon"]} />
            Join the chat now
          </LinkBtn>
        )
      ) : (
        <ChatControls
          className={styles["chat__controls"]}
          isDisabled={true}
          isStreamOnline={props.isStreamOnline}
        />
      )}
    </div>
  );
}

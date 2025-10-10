import * as React from "react";

import { ChatControls, MsgsList } from "../../features/chat";
import { useCreateMessageWSEvent } from "../../features/ws/hooks/use-create-message-ws-event";
import { useDeleteMessageWSEvent } from "../../features/ws/hooks/use-delete-message-ws-event";
import { sortMessages } from "../../utils";
import {
  useDeleteMessageMutation,
  useGetChatHistoryQuery,
  usePostNewMessageMutation,
} from "../../features/chat/chat-slice";
import { useStreamStateWSEvent } from "../../features/ws/hooks/use-stream-state-ws-event";
import { StreamBar } from "../../features/stream";
import { Navbar } from "../../features/chat/navbar";

import styles from "./chat-page.module.css";
import { LinkBtn } from "../../features/ui/btn";
import { CrowdIcon } from "../../features/ui/icons";
import { PATHS } from "../../config/constants";
import { UsersList } from "../../features/chat/users-list/users-list";

export function ChatPage(): React.ReactElement {
  const user = null; // TODO: get from Redux

  const streamState = useStreamStateWSEvent(); // TODO: get from Redux
  const [postMessage] = usePostNewMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

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

  //

  useCreateMessageWSEvent(postMessage);
  useDeleteMessageWSEvent(deleteMessage);

  return (
    <>
      <StreamBar
        streamState={streamState}
        className={styles["chat-page__stream"]}
      />

      <Navbar className={styles["chat-page__nav"]} />

      {/*
        <UsersList
          className={styles["chat-page__main-content"]}
          users={[
            { username: "TestA" },
            { username: "TestB" },
            { username: "TestC" },
            { username: "TestD" },
          ]}
        />*/}

      <MsgsList
        className={styles["chat-page__main-content"]}
        isLoading={isGetChatHistoryLoading}
        isError={isGetChatHistoryError}
        isSuccess={isGetChatHistorySuccess}
        messages={sortedMessages}
        handleDeleteMessage={deleteMessage}
      />

      {!user ? (
        <ChatControls
          className={styles["chat-page__controls"]}
          isDisabled={isGetChatHistoryFetching}
          isStreamOnline={streamState.isOnline}
        />
      ) : (
        <LinkBtn
          theme="quaternary"
          className={styles["chat-page__join-chat-btn"]}
          href={PATHS.signIn}
        >
          <CrowdIcon className={styles["chat-page__join-chat-btn-icon"]} /> Join
          the chat now
        </LinkBtn>
      )}
    </>
  );
}

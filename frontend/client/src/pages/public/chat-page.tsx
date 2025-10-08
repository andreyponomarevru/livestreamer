import * as React from "react";

import { ChatControls, ChatMsg } from "../../features/user-profile_public/chat";
import { useCreateMessageWSEvent } from "../../features/ws/hooks/use-create-message-ws-event";
import { useDeleteMessageWSEvent } from "../../features/ws/hooks/use-delete-message-ws-event";
import { sortMessages } from "../../utils";
import {
  useDeleteMessageMutation,
  useGetChatHistoryQuery,
  usePostNewMessageMutation,
} from "../../features/user-profile_public/chat/chat-slice";
import { Loader } from "../../features/ui/loader/loader-component";
import { useStreamStateWSEvent } from "../../features/ws/hooks/use-stream-state-ws-event";
import { StreamBar } from "../../features/user-profile_public/stream";
import { Navbar } from "../../features/user-profile_public/chat/navbar";

import styles from "./chat-page.module.css";

export function ChatPage(): React.ReactElement {
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

      <ul className={styles["chat-page__chat"]}>
        {isGetChatHistoryLoading && <Loader />}
        {isGetChatHistoryError && (
          <div>Oops! Something went wrong. Please try again later.</div>
        )}
        {isGetChatHistorySuccess && (
          <>
            {sortedMessages?.map((msg) => (
              <ChatMsg
                message={msg}
                key={msg.id}
                handleDeleteMessage={deleteMessage}
              />
            ))}
            <li className={styles["scroll-to"]} ref={messagesEndRef} />
          </>
        )}
      </ul>

      <ChatControls
        isDisabled={isGetChatHistoryFetching}
        isStreamOnline={streamState.isOnline}
        className={styles["chat-page__controls"]}
      />
    </>
  );
}

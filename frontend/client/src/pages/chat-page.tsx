import * as React from "react";

import { ChatControls, ChatMsg } from "../features/chat";
import { useCreateMessageWSEvent } from "../features/ws/hooks/use-create-message-ws-event";
import { useDeleteMessageWSEvent } from "../features/ws/hooks/use-delete-message-ws-event";
import { sortMessages } from "../utils";
import {
  useDeleteMessageMutation,
  useGetChatHistoryQuery,
  usePostNewMessageMutation,
} from "../features/chat/chat-slice";
import { Loader } from "../features/ui/loader/loader";
import { useStreamStateWSEvent } from "../features/ws/hooks/use-stream-state-ws-event";

import "./chat-page.scss";
import { StreamBar } from "../features/stream";

function PagesChat(): React.ReactElement {
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
    <div className="chat-page">
      <StreamBar streamState={streamState} className="chat-page__stream" />

      <div className="chat-page__chat">
        {isGetChatHistoryLoading && <Loader color="pink" />}
        {isGetChatHistoryError && (
          <div>Oops! Something went wrong. Please try again later.</div>
        )}
        {isGetChatHistorySuccess && (
          <ul className="chat-page__messages-list">
            {sortedMessages?.map((msg) => (
              <ChatMsg
                message={msg}
                key={msg.id}
                handleDeleteMessage={deleteMessage}
              />
            ))}
            <li className="scroll-to" ref={messagesEndRef} />
          </ul>
        )}

        <ChatControls
          isDisabled={isGetChatHistoryFetching}
          isStreamOnline={streamState.isOnline}
        />
      </div>
    </div>
  );
}

export { PagesChat };

import * as React from "react";

import { type ChatMsg as ChatMsgType } from "../../../../types";
import { ChatMsg } from "./chat-msg";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  messages: ChatMsgType[];
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
}

export function MsgsList(props: Props) {
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView();
  }
  const messagesEndRef = React.useRef<null | HTMLLIElement>(null);
  React.useEffect(scrollToBottom, [props.messages]);

  return (
    <ul className="chat-page__messages-list">
      {props.messages.map((msg) => {
        console.log(msg);
        return (
          <ChatMsg
            message={msg}
            key={msg.id}
            handleDeleteMessage={props.handleDeleteMessage}
          />
        );
      })}
      <li className="scroll-to" ref={messagesEndRef} />
    </ul>
  );
}

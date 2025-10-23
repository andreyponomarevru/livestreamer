import * as React from "react";

import { type ChatMsg as ChatMsgType } from "../../../../types";
import { ChatMsg } from "./chat-msg";

import styles from "./msgs-list.module.css";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  messages?: ChatMsgType[];
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
}

export function MsgsList(props: Props) {
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView();
  }
  const messagesEndRef = React.useRef<null | HTMLLIElement>(null);
  React.useEffect(scrollToBottom, [props.messages]);

  return (
    <ul className={`${styles["msgs-list"]} ${props.className || ""}`}>
      {props.messages?.map((msg) => (
        <ChatMsg
          message={msg}
          key={msg.id}
          handleDeleteMessage={props.handleDeleteMessage}
        />
      ))}
      <li className={styles["scroll-to"]} ref={messagesEndRef} />
    </ul>
  );
}

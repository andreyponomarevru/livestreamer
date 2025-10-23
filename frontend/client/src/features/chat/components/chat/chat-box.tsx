import * as React from "react";

import {
  IoClose,
  MessagetIcon,
  CrowdIcon,
} from "../../../../features/ui/icons";
import { Chat } from "./chat";
import { UsersList } from "./users-list";
import { useStreamStateWSEvent } from "../../../ws/hooks/use-stream-state-ws-event";

import styles from "./chat-box.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleCloseChatClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ChatBox(props: Props) {
  const [tab, setTab] = React.useState("chat");

  const streamState = useStreamStateWSEvent(); // TODO: get from Redux

  const users = [
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
    { username: "TestA" },
    { username: "TestB" },
    { username: "TestC" },
    { username: "TestD" },
  ];

  return (
    <div className={`${styles["chat-box"]} ${props.className || ""}`}>
      <nav className={styles["chat-box__navbar"]}>
        <div className={styles["chat-box__tabs"]}>
          <div
            className={`${styles["chat-box__tab"]} ${tab === "chat" ? styles["chat-box__tab_active"] : ""}`}
            onClick={() => setTab("chat")}
          >
            <div className={styles["chat-box__tab-content-1"]}>
              <MessagetIcon
                className={`${styles["chat-box__icon"]} ${styles["chat-box__icon_color_charcoal-30"]}`}
              />
              Chat
            </div>
          </div>

          <div
            className={`${styles["chat-box__tab"]} ${tab === "users" ? styles["chat-box__tab_active"] : ""}`}
            onClick={() => setTab("users")}
          >
            <div className={styles["chat-box__tab-content-1"]}>
              <CrowdIcon
                className={`${styles["chat-box__icon"]} ${styles["chat-box__icon_color_charcoal-30"]}`}
              />
              Users
            </div>
            <div className={styles["chat-box__tab-content-2"]}>13</div>
          </div>
        </div>

        <div className={styles["chat-box__devider"]}></div>

        <button
          className={styles["chat-box__close-btn"]}
          onClick={() => props.handleCloseChatClick(true)}
        >
          <IoClose
            className={`${styles["chat-box__icon"]} ${styles["chat-box__icon_color_charcoal-60"]}`}
          />
        </button>
      </nav>

      {tab === "users" && (
        <UsersList className={styles["chat-box__content"]} users={users} />
      )}
      {tab === "chat" && (
        <Chat
          className={styles["chat-box__content"]}
          isStreamOnline={streamState.isOnline}
        />
      )}
    </div>
  );
}

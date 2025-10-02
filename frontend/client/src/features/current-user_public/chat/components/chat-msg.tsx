import * as React from "react";

import { ChatIconBtn } from "./chat-icon-btn";
import { type ChatMsg } from "../../../../types";
import { hasPermission } from "../../../../utils";
import { useNavigate } from "react-router";
import { PATHS } from "../../../../config/constants";
import { useMessageLikeToggle } from "../use-message-like-toggle";
import { useLikeMessageWSEvent } from "../../../ws/hooks/use-like-message-ws-event";
import { useUnlikeMessageWSEvent } from "../../../ws/hooks/use-unlike-message-ws-event";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../current-user_private/current-user-slice";

import styles from "./chat-msg.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  handleDeleteMessage: (msg: { messageId: number; userId: number }) => void;
  message: ChatMsg;
}

export function ChatMsg(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const navigate = useNavigate();

  const hasPermissionToDelete =
    hasPermission({ resource: "any_chat_message", action: "delete" }, user) ||
    props.message.userId === user?.id;

  const { likes, toggleLike, setLikes, isLiked } = useMessageLikeToggle(
    user,
    props.message.likedByUserId,
  );

  useLikeMessageWSEvent(props.message.id, setLikes);
  useUnlikeMessageWSEvent(props.message.id, setLikes);

  return (
    <li className={`${styles["chat-msg"]} ${props.className || ""}`}>
      <div className={styles["chat-msg__header"]}>
        <span className={styles["chat-msg__meta"]}>
          <span className={styles["chat-msg__username"]}>
            {props.message.username}
          </span>
          <span>&#8226;</span>
          <span className={styles["chat-msg__timestamp"]}>
            {new Date(props.message.createdAt).toLocaleTimeString()}
          </span>
        </span>
      </div>

      <div className={styles["chat-msg__body"]}>{props.message.message}</div>

      <div className={styles["chat-msg__buttons"]}>
        {hasPermissionToDelete && (
          <ChatIconBtn
            icon="trash-can"
            handleBtnClick={() =>
              props.handleDeleteMessage({
                messageId: props.message.id,
                userId: props.message.userId,
              })
            }
          />
        )}
        <div className={styles["chat-msg__like-box"]}>
          <span
            className={`${styles["chat-msg__like-counter"]} ${
              user && likes.has(user.id)
                ? styles["chat-msg__like-counter_liked"]
                : ""
            }`}
          >
            {likes.size > 0 ? likes.size : null}
          </span>

          <ChatIconBtn
            isActive={isLiked(likes)}
            icon="like"
            handleBtnClick={() => {
              if (!user) navigate(PATHS.signIn);
              else toggleLike(props.message.id);
            }}
          />
        </div>
      </div>
    </li>
  );
}

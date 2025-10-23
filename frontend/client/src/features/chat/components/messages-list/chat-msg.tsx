import * as React from "react";

import { LikeBtn, DeleteBtn } from "./reaction-buttons";
import { type ChatMsg } from "../../../../types";
import { hasPermission } from "../../../../utils";
import { useNavigate } from "react-router";
import { PATHS } from "../../../../config/constants";
import { useMessageLikeToggle } from "../../use-message-like-toggle";
import { useLikeMessageWSEvent } from "../../../ws/hooks/use-like-message-ws-event";
import { useUnlikeMessageWSEvent } from "../../../ws/hooks/use-unlike-message-ws-event";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../auth";
import { FaCircleUser } from "../../../ui/icons";

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
      {!user ? (
        "ava"
      ) : (
        <FaCircleUser
          color="var(--color_charcoal-30)"
          className={styles["chat-msg__avatar"]}
        />
      )}

      <div className={styles["chat-msg__header"]}>{props.message.username}</div>

      <div className={styles["chat-msg__body"]}>{props.message.message}</div>

      <div className={styles["chat-msg__controls"]}>
        {hasPermissionToDelete && (
          <DeleteBtn
            handleBtnClick={() =>
              props.handleDeleteMessage({
                messageId: props.message.id,
                userId: props.message.userId,
              })
            }
          />
        )}

        <LikeBtn
          isLiked={isLiked(likes)}
          handleBtnClick={() => {
            if (!user) navigate(PATHS.signIn);
            else toggleLike(props.message.id);
          }}
          likesCount={likes.size > 0 ? likes.size : 0}
          /*className={
            user && likes.has(user.id)
              ? styles["chat-msg__reaction-btn_liked"]
              : ""
          }*/
        />
      </div>
    </li>
  );
}

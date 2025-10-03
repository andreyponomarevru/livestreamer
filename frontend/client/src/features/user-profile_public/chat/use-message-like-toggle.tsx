import * as React from "react";

import { API_ROOT_URL } from "../../../config/env";
import { useFetch } from "../../../hooks/use-fetch";
import { type ChatMsg, type User } from "../../../types";

export function useMessageLikeToggle(
  user: User | null,
  messageLikes: ChatMsg["likedByUserId"],
) {
  function isLiked(likes: Set<number>) {
    return !!user && likes.has(user.id);
  }

  const [likes, setLikes] = React.useState(new Set(messageLikes));

  const { state: likeMsgResponse, fetchNow: sendLikeMsgRequest } = useFetch();
  React.useEffect(() => {
    if (user && likeMsgResponse.response) {
      setLikes(new Set([...likes, user!.id]));
    }
  }, [likeMsgResponse]);

  const { state: unlikeMsgResponse, fetchNow: sendUnlikeMsgRequest } =
    useFetch();
  React.useEffect(() => {
    if (user && unlikeMsgResponse.response) {
      setLikes((prev) => new Set([...prev].filter((id) => id !== user!.id)));
    }
  }, [unlikeMsgResponse]);

  function toggleLike(messageId: number) {
    if (isLiked(likes)) {
      sendUnlikeMsgRequest(`${API_ROOT_URL}/chat/messages/${messageId}/like`, {
        method: "DELETE",
      });
    } else {
      sendLikeMsgRequest(`${API_ROOT_URL}/chat/messages/${messageId}/like`, {
        method: "POST",
      });
    }
  }

  return { likes, toggleLike, setLikes, isLiked };
}

import * as React from "react";
import { useNavigate } from "react-router";

import { API_ROOT_URL } from "../config/env";
import { PATHS } from "../config/constants";
import { useFetch } from "./use-fetch";
import { useStreamLikeCount } from "../features/user-profile_public/stream";
import { type User } from "../types";

type StreamLikeButton = {
  handleBtnClick: () => void;
  isBtnEnabled: boolean;
  setIsBtnEnabled: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useStreamLikeButton(user: User | null): StreamLikeButton {
  function handleBtnClick() {
    if (!user) {
      navigate(PATHS.signIn);
    } else {
      sendLikeBroadcastRequest(`${API_ROOT_URL}/stream/like`, {
        method: "PUT",
      });
    }
  }

  const { setLikeCount } = useStreamLikeCount();
  const {
    state: likeBroadcastResponse,
    fetchNow: sendLikeBroadcastRequest,
    resetState,
  } = useFetch();
  React.useEffect(() => {
    if (likeBroadcastResponse.response) {
      resetState();
      setLikeCount((likeCount) => ++likeCount);
      setIsBtnEnabled(false);
      // TODO
      // was: } else if (likeBroadcastResponse.error?.status === 401) {
      // so rewrite with RTQ to check the response status code
      //} else if (likeBroadcastResponse.error === 401) {
      //  auth.setUser(null);
      //  navigate(ROUTES.signIn);
    } else if (likeBroadcastResponse.error) {
      console.error(likeBroadcastResponse.error);
    }
  }, [likeBroadcastResponse]);

  const navigate = useNavigate();

  const [isBtnEnabled, setIsBtnEnabled] = React.useState(false);

  return { handleBtnClick, isBtnEnabled, setIsBtnEnabled };
}

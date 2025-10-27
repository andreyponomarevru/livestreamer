import * as React from "react";

import { LIKE_TIMEOUT_MS } from "../../../../config/env";
import { useStreamLikeButton } from "../../../../hooks/use-stream-like-button";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../auth";

import styles from "./heart-btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function HeartBtn(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const { handleBtnClick, setIsBtnEnabled, isBtnEnabled } =
    useStreamLikeButton(user);
  React.useEffect(() => {
    setIsBtnEnabled(props.isStreamOnline);
  }, [props.isStreamOnline]);

  React.useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!isBtnEnabled && props.isStreamOnline) {
      timerId = setTimeout(() => setIsBtnEnabled(true), LIKE_TIMEOUT_MS);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isBtnEnabled]);

  return (
    <button
      disabled={!isBtnEnabled}
      className={`${styles["heart-btn"]} ${
        isBtnEnabled && props.isStreamOnline ? "" : styles["heart-btn_disabled"]
      } ${props.className || ""}`}
      onClick={
        isBtnEnabled && props.isStreamOnline ? handleBtnClick : undefined
      }
      type="submit"
      name="heart"
      value=""
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 26.458 26.458"
        className={`${styles["icons"]} ${styles["heart-btn__icon"]} ${props.className}`}
      >
        <path d="M7.383 2.748c1.353 0 2.594.429 3.688 1.275 1.049.81 1.747 1.844 2.158 2.595.411-.751 1.11-1.784 2.158-2.595 1.094-.846 2.335-1.275 3.688-1.275 3.778 0 6.626 3.09 6.626 7.187 0 4.426-3.554 7.454-8.933 12.039-.914.778-1.95 1.66-3.026 2.602a.778.778 0 0 1-1.026 0 307.403 307.403 0 0 0-3.026-2.603C4.31 17.39.757 14.361.757 9.935c0-4.097 2.849-7.187 6.626-7.187z" />
        <animate
          begin="click"
          attributeName="fill"
          values="#333333;#aa0500"
          dur="10s"
          repeatCount="1"
          fill="remove"
        />
      </svg>
    </button>
  );
}

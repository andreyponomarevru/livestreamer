import * as React from "react";

import { useIsMounted } from "../../../hooks/use-is-mounted";
import { LIKE_TIMEOUT_MS } from "../../../config/env";
import { useStreamLikeButton } from "../../../hooks/use-stream-like-button";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../current-user/current-user-slice";

import icons from "./../../../assets/icons.svg";
import styles from "./heart-btn.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function HeartBtn(props: Props): React.ReactElement {
  const isMounted = useIsMounted();

  const user = useAppSelector(selectCurrentUserProfile);
  const { handleBtnClick, setIsBtnEnabled, isBtnEnabled } =
    useStreamLikeButton(user);
  React.useEffect(() => {
    if (isMounted) setIsBtnEnabled(props.isStreamOnline);
  }, [props.isStreamOnline, isMounted]);

  React.useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isMounted && !isBtnEnabled && props.isStreamOnline) {
      timerId = setTimeout(() => setIsBtnEnabled(true), LIKE_TIMEOUT_MS);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [isBtnEnabled, isMounted]);

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
      <svg className={styles["heart-btn__icon default-icon"]}>
        <use href={`${icons}#heart`} />
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

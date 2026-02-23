import type { ReactElement } from "react";

import { PATHS } from "../../../config/constants";
import { LinkBtn } from "../btn/link-btn-component";
import { DjIcon } from "../icons";

import styles from "./start-live-stream-btn.module.css";

interface Props extends React.HTMLAttributes<ReactElement> {
  text?: string;
}

export function StartLiveStreamBtn(props: Props) {
  return (
    <LinkBtn theme="quaternary" href={PATHS.signIn}>
      <DjIcon className={styles["start-live-stream-btn__dj-icon"]} />
      {props.text || "Start live stream"}
    </LinkBtn>
  );
}

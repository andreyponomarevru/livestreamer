import { PiBroadcastFill } from "../icons";

import styles from "./stream-status-badge.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOnline: boolean;
}

export function StreamStatusBadge(props: Props) {
  return (
    <div
      className={`${styles["stream-status-badge"]} ${props.isOnline ? styles["stream-status-badge_online"] : styles["stream-status-badge_offline"]} ${props.className || ""}`}
    >
      <PiBroadcastFill className={styles["stream-status-badge__icon"]} />
      {props.isOnline ? "live now" : "offline"}
    </div>
  );
}

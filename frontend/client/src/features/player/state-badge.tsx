import { PiBroadcastFill } from "../ui/icons";

import styles from "./state-badge.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
}

export function StateBadge(props: Props) {
  const classes = `${styles["state-badge"]} ${!props.isStreamOnline ? styles["state-badge_status_on"] : styles["state-badge_status_off"]} ${props.className || ""}`;

  return (
    <div className={classes}>
      {!props.isStreamOnline ? (
        <>
          <PiBroadcastFill className={styles["state-badge__icon"]} />
          live now
        </>
      ) : (
        "offline"
      )}
    </div>
  );
}

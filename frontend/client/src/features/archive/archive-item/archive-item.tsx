import React from "react";

import { FaPencilAlt } from "react-icons/fa";

import { ArchiveItemControls } from "../archive-item-controls/archive-item-controls";
import { hasPermission } from "../../../utils";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../admin-panel/current-user-slice";

import styles from "./archive-item.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  likeCount: number;
  listenerPeakCount: number;
  date: string;
  isBookmarked?: boolean;

  permissions?: {
    broadcast: string;
  };
}

export function ArchiveItem(props: Props): React.ReactElement {
  const { isBookmarked = false } = props;

  const user = useAppSelector(selectCurrentUserProfile);
  const permissions = user?.permissions;

  //

  const [isControlsOpened, setIsControlsOpened] = React.useState(false);

  function toggleControls() {
    setIsControlsOpened((prev) => !prev);
  }

  return (
    <li className={`${styles["archive-item"]} ${props.className || ""}`}>
      <span className={styles["archive-item__meta1"]}>
        <span className={styles["archive-item__date"]}>{props.date}</span>
        {/*<IconBtn
          iconName={props.isBookmarked ? "bookmark-selected" : "bookmark"}
          handleBtnClick={() => {}}
          className="archive-item__bookmark"
        />*/}
      </span>
      <header className={styles["archive-item__header"]}>
        <a href="https://www.mixcloud.com/">
          <h3
            className={styles["archive-item__heading"]}
            contentEditable={hasPermission(
              { resource: "broadcast", action: "update_partially" },
              user,
            )}
            suppressContentEditableWarning={true}
          >
            {props.title}
          </h3>
        </a>
      </header>

      <span className={styles["archive-item__meta2"]}>
        <span className={styles["archive-item__listeners"]}>
          Max Listeners:{" "}
          <span className={styles["archive-item__count"]}>
            {props.listenerPeakCount}
          </span>
        </span>
        <span className={styles["archive-item__hearts"]}>
          Likes:{" "}
          <span className={styles["archive-item__count"]}>
            {props.likeCount}
          </span>
        </span>
      </span>
      <span className={styles["archive-item__controls"]}>
        {/*<IconBtn iconName="tracklist" handleBtnClick={() => {}} />*/}
        {hasPermission(
          { resource: "broadcast", action: "update_partially" },
          user,
        ) && <FaPencilAlt onClick={toggleControls} />}
      </span>
      {isControlsOpened && <ArchiveItemControls />}
    </li>
  );
}

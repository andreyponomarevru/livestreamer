import React from "react";

import { IconBtn } from "../../../features/ui/icon-btn/icon-btn";
import { ArchiveItemControls } from "../archive-item-controls/archive-item-controls";
import { hasPermission } from "../../../utils";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../features/current-user/current-user-slice";

import "./archive-item.scss";

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

function ArchiveItem(props: Props): React.ReactElement {
  const { className = "", isBookmarked = false } = props;

  const user = useAppSelector(selectCurrentUserProfile);
  const permissions = user?.permissions;

  //

  const [isControlsOpened, setIsControlsOpened] = React.useState(false);

  function toggleControls() {
    setIsControlsOpened((prev) => !prev);
  }

  return (
    <li className={`archive-item ${className}`}>
      <span className="archive-item__meta1">
        <span className="archive-item__date">{props.date}</span>
        {/*<IconBtn
          iconName={props.isBookmarked ? "bookmark-selected" : "bookmark"}
          handleBtnClick={() => {}}
          className="archive-item__bookmark"
        />*/}
      </span>
      <header className="archive-item__header">
        <a href="https://www.mixcloud.com/">
          <h3
            className="archive-item__heading"
            contentEditable={hasPermission(
              { resource: "broadcast", action: "update_partially" },
              user
            )}
            suppressContentEditableWarning={true}
          >
            {props.title}
          </h3>
        </a>
      </header>

      <span className="archive-item__meta2">
        <span className="archive-item__listeners">
          Max Listeners:{" "}
          <span className="archive-item__count">{props.listenerPeakCount}</span>
        </span>
        <span className="archive-item__hearts">
          Likes: <span className="archive-item__count">{props.likeCount}</span>
        </span>
      </span>
      <span className="archive-item__controls">
        {/*<IconBtn iconName="tracklist" handleBtnClick={() => {}} />*/}
        {hasPermission(
          { resource: "broadcast", action: "update_partially" },
          user
        ) && <IconBtn iconName="pencil" handleBtnClick={toggleControls} />}
      </span>
      {isControlsOpened && <ArchiveItemControls />}
    </li>
  );
}

export { ArchiveItem };

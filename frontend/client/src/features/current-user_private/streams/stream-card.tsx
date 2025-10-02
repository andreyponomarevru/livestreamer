import * as React from "react";
import {
  FiMoreHorizontal,
  MessagetIcon,
  HeartIcon,
  ListenersIcon,
  FaClock,
  PiLinkSimpleBold,
  FaShare,
  MdEdit,
  BiSolidTrashAlt,
} from "../../ui/icons";

import styles from "./stream-card.module.css";
import { StreamStatusBadge } from "../../ui/stream-status-badge/stream-status-badge";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  meta?: {
    date?: number;
    duration?: number;
    peakListenersCount?: number;
    heartsCount?: number;
    chaetMessagesCount?: number;
  };
}

export function StreamCard(props: Props) {
  const isScheduled = props.meta?.date && props.meta.date > Date.now();
  const scheduledStyle = isScheduled
    ? styles["stream-card__photo_scheduled"]
    : "";

  // TODO fix this condition
  const isPlayingNow = props.meta?.date && props.meta.date > Date.now();

  const date = "01 Sept 26";
  const duration = "1h 25m";

  const peakListenersCount = 19;
  const likesCount = 260;
  const chatMessagesCount = 58;

  //

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <a href="#" className={styles["stream-card"]}>
      <div className={styles["stream-card__cover"]}>
        <img
          className={`${styles["stream-card__photo"]} ${scheduledStyle}`}
          src="https://www.wildlifeworldwide.com/images/discover/europe_norway_tromso_northern_lights_square.jpg"
        />
        {isPlayingNow && (
          <StreamStatusBadge
            isOnline={true}
            className={styles["stream-card__badge"]}
          />
        )}
        {isScheduled && (
          <div className={styles["stream-card__scheduled-icon-box"]}>
            <FaClock className={styles["stream-card__scheduled-icon"]} />
          </div>
        )}
      </div>

      <div className={styles["stream-card__details-box"]}>
        <div className={styles["stream-card__details"]}>
          <span className="text-sm">
            {date}
            <span className={styles["stream-card__devider"]}>·</span>
            {duration}
          </span>
          <h6 className={styles["stream-card__title"]}>
            My First ever stream Bithday
          </h6>

          {!isScheduled && (
            <span
              className={`${styles["stream-card__bottom-btns"]} small-text`}
            >
              <div className={styles["stream-card__bottom-btn"]}>
                <ListenersIcon className={styles["stream-card__small-icons"]} />
                {peakListenersCount}
              </div>
              <div className={styles["stream-card__bottom-btn"]}>
                <HeartIcon className={styles["stream-card__small-icons"]} />
                {likesCount}
              </div>
              <div className={styles["stream-card__bottom-btn"]}>
                <MessagetIcon className={styles["stream-card__small-icons"]} />
                {chatMessagesCount}
              </div>
            </span>
          )}
        </div>

        <nav className={styles["stream-card__nav"]}>
          <button
            className={styles["stream-card__menu-btn"]}
            onClick={(e) => {
              e.preventDefault();
              setIsMenuOpen((v) => !v);
            }}
          >
            <FiMoreHorizontal className={styles["stream-card__btn-icon"]} />
          </button>

          <ul
            className={`${styles["stream-card__menu"]} popup ${isMenuOpen ? `${styles["stream-card__menu_open"]} popup_open` : ""}`}
          >
            <li className={styles["stream-card__menu-row"]}>
              <PiLinkSimpleBold className={styles["stream-card__menu-icon"]} />
              Copy link
            </li>
            <li className={styles["stream-card__menu-row"]}>
              <FaShare className={styles["stream-card__menu-icon"]} />
              Share
            </li>
            <li className={styles["stream-card__menu-row"]}>
              <MdEdit className={styles["stream-card__menu-icon"]} />
              Edit
            </li>
            <li className={styles["stream-card__menu-row"]}>
              <BiSolidTrashAlt className={styles["stream-card__menu-icon"]} />
              Delete
            </li>
          </ul>
        </nav>
      </div>
    </a>
  );
}

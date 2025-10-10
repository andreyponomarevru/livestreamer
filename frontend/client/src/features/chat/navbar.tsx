import { IoClose, MessagetIcon, CrowdIcon } from "../../features/ui/icons";

import styles from "./navbar.module.css";

export function Navbar(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={`${styles["nav"]} ${props.className || ""}`}>
      <div className={styles["nav__tabs"]}>
        <div className={`${styles["nav__tab"]} ${styles["nav__tab_active"]}`}>
          <div className={styles["nav__tab-content-1"]}>
            <MessagetIcon className={styles["nav__icon"]} />
            Chat
          </div>
        </div>
        <div className={styles["nav__tab"]}>
          <div className={styles["nav__tab-content-1"]}>
            <CrowdIcon className={styles["nav__icon"]} />
            Users
          </div>
          <div className={styles["nav__tab-content-2"]}>13</div>
        </div>
      </div>
      <div className={styles["nav__devider"]}></div>
      <button className={styles["nav__close-btn"]}>
        <IoClose className={styles["nav__icon"]} />
      </button>
    </nav>
  );
}

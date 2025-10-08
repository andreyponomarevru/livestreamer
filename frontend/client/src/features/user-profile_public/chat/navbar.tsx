import { RxCross1 } from "../../../features/ui/icons";

import styles from "./navbar.module.css";

export function Navbar(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={`${styles["nav"]} ${props.className || ""}`}>
      <div className={styles["nav__tabs"]}>
        <span className={styles["nav__tab"]}>Chat</span>
        <span className={styles["nav__tab"]}>
          Users
          <span className={styles["nav__count"]}>13</span>
        </span>
      </div>
      <span>
        <RxCross1 />
      </span>
    </nav>
  );
}

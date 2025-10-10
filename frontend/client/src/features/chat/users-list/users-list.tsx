import { FaCircleUser } from "../../ui/icons";

import styles from "./users-list.module.css";

interface Props extends React.HTMLAttributes<HTMLUListElement> {
  users: { avatar?: string; username: string }[];
}

export function UsersList(props: Props) {
  return (
    <ul className={styles["users-list"]}>
      {props.users.map((user) => (
        <li className={styles["users-list__row"]} key={user.username}>
          <FaCircleUser className={styles["users-list__avatar"]} />
          <span className={styles["users-list__username"]}>
            {user.username}
          </span>
        </li>
      ))}
    </ul>
  );
}

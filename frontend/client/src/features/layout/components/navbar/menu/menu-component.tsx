import React from "react";
import { NavLink } from "react-router-dom";

import { hasPermission } from "../../../../../utils";
import { useAppSelector } from "../../../../../hooks/redux-ts-helpers";
import {
  AuthToggle,
  selectCurrentUserProfile,
  useSignOutMutation,
} from "../../../../current-user";
import {
  HiOutlineLogout,
  FaCircleUser,
  IoIosArrowForward,
} from "../../../../ui/icons";
import { PATHS } from "../../../../../app/routes";

import styles from "./menu.module.css";

interface Props {
  isOpen: boolean;
}

export function Menu(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const [signOut] = useSignOutMutation();

  async function handleSignOut() {
    try {
      await signOut().unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  if (user) {
    return (
      <ul
        className={`${styles["menu"]} ${props.isOpen ? styles["menu_open"] : ""}`}
      >
        <li className={styles["menu__item"]}>
          <div className={styles["menu__user-box"]}>
            {(user as any).avatar || (
              <FaCircleUser className={styles["menu__avatar"]} />
            )}
            <div className={styles["menu__user-meta-box"]}>
              <p className={styles["menu__username"]}>{user.username}</p>
              <a
                className={styles["menu__tip-link"]}
                href={`/${user.username}`}
              >
                Open profile
              </a>
            </div>
          </div>
        </li>

        {!!user && (
          <li className={styles["menu__item"]}>
            <NavLink
              className={styles["menu__link"]}
              end
              to={PATHS.private.settings}
              onClick={undefined /*item.onClick ? item.onClick : undefined*/}
            >
              <span>Settings</span>
              <IoIosArrowForward />
            </NavLink>
          </li>
        )}

        {!!user &&
          hasPermission(
            { resource: "all_user_accounts", action: "read" },
            user,
          ) && (
            <li className={styles["menu__item"]}>
              <NavLink
                className={styles["menu__link"]}
                end
                to={PATHS.private.streams}
              >
                My Streams
              </NavLink>
            </li>
          )}

        {!!user && (
          <li className={styles["menu__item"]}>
            <NavLink
              className={styles["menu__link"]}
              end
              to={PATHS.private.adminDashboard}
              onClick={handleSignOut}
            >
              Admin Dashboard
            </NavLink>
          </li>
        )}

        {!!user && (
          <li className={styles["menu__item"]}>
            <NavLink className={styles["menu__link"]} end to={PATHS.signIn}>
              <div>
                <HiOutlineLogout className={styles["menu__icon"]} />
                <span>Log Out</span>
              </div>
            </NavLink>
          </li>
        )}
      </ul>
    );
  } else {
    return (
      <div
        className={`${styles.menu} ${props.isOpen ? styles["menu_open"] : ""}`}
      >
        <AuthToggle />
      </div>
    );
  }
}

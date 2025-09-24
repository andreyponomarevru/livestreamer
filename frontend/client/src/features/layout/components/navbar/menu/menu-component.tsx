import React from "react";
import { NavLink } from "react-router-dom";

import { hasPermission } from "../../../../../utils";
import { useAppSelector } from "../../../../../hooks/redux-ts-helpers";
import {
  AuthToggle,
  selectCurrentUserProfile,
  useSignOutMutation,
} from "../../../../current-user";
import { HiOutlineLogout } from "../../../../ui/icons";
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
        className={`${styles.menu} ${props.isOpen ? styles["menu_open"] : ""}`}
      >
        {!!user && (
          <li>
            <NavLink
              className={styles.menu__link}
              end
              to={PATHS.private.settings}
              onClick={undefined /*item.onClick ? item.onClick : undefined*/}
            >
              Settings
            </NavLink>
          </li>
        )}

        {!!user &&
          hasPermission(
            { resource: "all_user_accounts", action: "read" },
            user,
          ) && (
            <li>
              <NavLink
                className={styles.menu__link}
                end
                to={PATHS.private.streams}
              >
                My Streams
              </NavLink>
            </li>
          )}

        {!!user && (
          <li>
            <NavLink
              className={styles.menu__link}
              end
              to={PATHS.private.adminDashboard}
              onClick={handleSignOut}
            >
              Admin Dashboard
            </NavLink>
          </li>
        )}

        {!!user && (
          <li>
            <NavLink className={styles.menu__link} end to={PATHS.signIn}>
              <HiOutlineLogout />
              Log Out
            </NavLink>
          </li>
        )}

        {/*item.hasPermission ? (
          <li>
            <NavLink
              className={styles.menu__link}
              end
              to={item.to}
              onClick={item.onClick ? item.onClick : undefined}
            >
              {item.icon}

              {item.text}
            </NavLink>
          </li>
        ) : null;
*/}
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

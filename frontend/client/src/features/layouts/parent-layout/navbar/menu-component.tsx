import React from "react";
import { NavLink } from "react-router";

import { generatePath, hasPermission } from "../../../../utils";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import {
  selectCurrentUserProfile,
  useSignOutMutation,
} from "../../../current-user";
import {
  HiOutlineLogout,
  FaCircleUser,
  FaUser,
  FaUnlock,
} from "../../../ui/icons";
import { PATHS } from "../../../../config/constants";

import styles from "./menu.module.css";
import type { User } from "../../../../types";
import { API_ROOT_URL } from "../../../../config/env";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

export function Menu(props: Props) {
  const user = useAppSelector(selectCurrentUserProfile);
  const [signOut] = useSignOutMutation();

  const listenUrl = generatePath(PATHS.public.listen, {
    username: user?.username,
  });

  async function handleSignOut() {
    try {
      await signOut().unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  if (!user) return null;

  const profilePictureUrl =
    new URL(API_ROOT_URL).origin + "/" + user.profilePictureUrl;

  return (
    <ul className={`${styles["menu"]} ${props.className || ""}`}>
      <li
        className={`${styles["menu__item"]} ${styles["menu__user-box"]} ${styles["menu__item"]}`}
      >
        <img src={profilePictureUrl} className={styles["menu__avatar"]} />

        <div className={styles["menu__user-meta-box"]}>
          <p className={styles["menu__username"]}>{props.user?.username}</p>
          <a className={styles["menu__tip-link"]} href={listenUrl}>
            Open profile
          </a>
        </div>
      </li>

      <li className={styles["menu__item"]}>
        <NavLink
          className={styles["menu__link"]}
          end
          to={PATHS.private.streams}
        >
          My Streams
        </NavLink>
      </li>

      <li className={styles["menu__item"]}>
        <hr className="hr" />
      </li>

      <li className={styles["menu__item"]}>
        Settings
        <SettingsSubmenu />
      </li>

      <li className={styles["menu__item"]}>
        <hr className="hr" />
      </li>

      {hasPermission(
        { resource: "any_user_account", action: "read" },
        user,
      ) && (
        <>
          <li className={styles["menu__item"]}>
            <NavLink
              className={styles["menu__link"]}
              end
              to={PATHS.private.adminDashboard}
            >
              Admin Dashboard
            </NavLink>
          </li>

          <li className={styles["menu__item"]}>
            <hr className="hr" />
          </li>
        </>
      )}

      <li className={`${styles["menu__extras"]} ${styles["menu__item"]}`}>
        <NavLink
          className={styles["menu__link"]}
          end
          to={PATHS.signIn}
          onClick={handleSignOut}
        >
          <div>
            <HiOutlineLogout className={styles["menu__icon"]} />
            Log Out
          </div>
        </NavLink>
      </li>
    </ul>
  );
}

function SettingsSubmenu(props: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={`${styles["menu__submenu"]} ${props.className || ""}`}>
      <li className={`${styles["menu__submenu-item"]}`}>
        <NavLink
          className={styles["menu__link"]}
          end
          to={PATHS.private.settings.profile}
        >
          <div>
            <FaUser className={styles["menu__icon"]} />
            <span>Profile</span>
          </div>
        </NavLink>
      </li>

      <li className={styles["menu__submenu-item"]}>
        <NavLink
          className={styles["menu__link"]}
          end
          to={PATHS.private.settings.account}
        >
          <div>
            <FaUnlock className={styles["menu__icon"]} />
            <span>Account</span>
          </div>
        </NavLink>
      </li>
    </ul>
  );
}

import React from "react";
import { NavLink } from "react-router";

import { getRTKQueryErr, hasPermission } from "../../../../utils";
import { useSignOutMutation } from "../../../auth";
import { PATHS } from "../../../../config/constants";
import type { User } from "../../../../types";
import { API_ROOT_URL } from "../../../../config/env";
import { useGetMeQuery } from "../../../auth";
import { Loader, Message, HiOutlineLogout, Avatar } from "../../../ui";

import styles from "./menu.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: User | null;
}

export function Menu(props: Props) {
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useGetMeQuery();

  const [signOut] = useSignOutMutation();

  async function handleSignOut() {
    try {
      await signOut().unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  if (isUserLoading) return <Loader />;

  if (isUserError || !user)
    return <Message type="warning">{getRTKQueryErr(userError)}</Message>;

  return (
    <ul className={`${styles["menu"]} ${props.className || ""}`}>
      <li
        className={`${styles["menu__item"]} ${styles["menu__user-box"]} ${styles["menu__item"]}`}
      >
        <Avatar
          apiRootUrl={API_ROOT_URL}
          imgUrl={user?.profilePictureUrl}
          className={styles["menu__avatar"]}
        />

        <div className={styles["menu__user-meta-box"]}>
          <p className={styles["menu__username"]}>{props.user?.username}</p>
          <a
            className={styles["menu__tip-link"]}
            href={PATHS.protected.scheduledStreams}
          >
            Open profile
          </a>
        </div>
      </li>

      <li className={styles["menu__item"]}>
        <hr className="hr" />
      </li>

      <li className={styles["menu__item"]}>
        <NavLink
          className={styles["menu__link"]}
          end
          to={PATHS.protected.mySettingsIndex}
        >
          Settings
        </NavLink>
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
              to={PATHS.protected.adminDashboard}
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

import React from "react";
import { NavLink } from "react-router";

import { hasPermission } from "../../../../../utils";
import { useAppSelector } from "../../../../../hooks/redux-ts-helpers";
import {
  AuthToggle,
  selectCurrentUserProfile,
  useSignOutMutation,
} from "../../../../auth";
import {
  HiOutlineLogout,
  FaCircleUser,
  FaUser,
  FaUnlock,
  IoNotifications,
} from "../../../../ui/icons";
import { PATHS } from "../../../../../config/constants";

import styles from "./menu.module.css";

interface Props {
  isOpen: boolean;
}

export function Menu(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const [signOut] = useSignOutMutation();

  const [isSubmenuOpen, setIsSubmenuOpen] = React.useState({ settings: false });

  async function handleSignOut() {
    try {
      await signOut().unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  if (user) {
    return (
      <nav
        className={`${styles["menu"]} ${props.isOpen ? `${styles["menu_open"]} popup_open` : ""} popup`}
      >
        <div className={styles["menu__user-box"]}>
          {(user as any).avatar || (
            <FaCircleUser className={styles["menu__avatar"]} />
          )}
          <div className={styles["menu__user-meta-box"]}>
            <p className={styles["menu__username"]}>{user.username}</p>
            <a className={styles["menu__tip-link"]} href={PATHS.public.listen}>
              Open profile
            </a>
          </div>
        </div>

        <ul className={styles["menu__list"]}>
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
              <span
                className={styles["menu__link"]}
                onClick={() =>
                  setIsSubmenuOpen((p) => ({ ...p, settings: !p.settings }))
                }
              >
                <span>Settings</span>
              </span>

              <SettingsSubmenu
                className={
                  isSubmenuOpen.settings ? styles["menu__submenu_open"] : ""
                }
              />
            </li>
          )}

          {!!user && (
            <li className={styles["menu__item"]}>
              <NavLink
                className={styles["menu__link"]}
                end
                to={PATHS.private.adminDashboard}
              >
                Admin Dashboard
              </NavLink>
            </li>
          )}
        </ul>

        {!!user && (
          <div className={styles["menu__extras"]}>
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
          </div>
        )}
      </nav>
    );
  } else {
    return (
      <div
        className={`${styles["menu"]} popup ${props.isOpen ? `${styles["menu_open"]} popup_open` : ""}`}
      >
        <AuthToggle />
      </div>
    );
  }
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

      <li className={styles["menu__submenu-item"]}>
        <NavLink
          className={styles["menu__link"]}
          end
          to={PATHS.private.settings.notifications}
        >
          <div>
            <IoNotifications className={styles["menu__icon"]} />
            <span>Notifications</span>
          </div>
        </NavLink>
      </li>
    </ul>
  );
}

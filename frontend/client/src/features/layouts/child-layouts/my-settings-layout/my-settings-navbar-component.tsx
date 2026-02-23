import { NavLink } from "react-router";

import { PATHS } from "../../../../config/constants";

import styles from "./my-settings-navbar.module.css";

export function MySettingsNavbar() {
  const menu = [
    { to: PATHS.protected.myProfileSettings, text: "Profile" },
    { to: PATHS.protected.myAccountSettings, text: "Account" },
  ];

  return (
    <nav className={styles["navbar"]}>
      {...menu.map(({ to, text }) => {
        return (
          <NavLink
            end
            to={to}
            className={({ isActive }) =>
              isActive
                ? `${styles["my-settings-navbar__link"]} ${styles["my-settings-navbar__link_active"]}`
                : styles["my-settings-navbar__link"]
            }
          >
            {text}
          </NavLink>
        );
      })}
    </nav>
  );
}

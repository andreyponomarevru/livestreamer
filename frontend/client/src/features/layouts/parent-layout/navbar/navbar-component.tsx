import React from "react";
import { Link, useLocation } from "react-router";

import { FaCircleUser, RxHamburgerMenu, IoClose } from "../../../ui/icons";
import { Menu } from "./menu-component";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { AuthToggle, selectCurrentUserProfile } from "../../../auth";
import { Logo } from "./logo";
import { PATHS } from "../../../../config/constants";
import { Popup } from "../../../ui/popup/popup-component";

import styles from "./navbar.module.css";

const displayWhiteLocations = [
  "/",
  PATHS.private.settings.profile,
  PATHS.private.settings.account,
  PATHS.private.settings.notifications,
  PATHS.private.adminDashboard,
  PATHS.private.streams,
];

export function Navbar(
  props: React.HTMLAttributes<HTMLElement>,
): React.ReactElement {
  const location = useLocation();
  const user = useAppSelector(selectCurrentUserProfile);

  const [isPopupMenuOpen, setIsPopupMenuOpen] = React.useState(false);
  function toggleMenu() {
    setIsPopupMenuOpen((isOpen) => !isOpen);
  }

  React.useEffect(() => {
    setIsPopupMenuOpen(false);
  }, [location]);

  const authedUser = "Chillout Aggregator";

  const isDarkState = displayWhiteLocations.some(
    (path) => path === location.pathname,
  );

  return (
    <nav
      className={`${styles["navbar"]} ${isDarkState ? styles["navbar_light"] : styles["navbar_dark"]} ${props.className || ""}`}
    >
      <div className={styles["navbar__wrapper"]}>
        {isDarkState ? (
          <Link to="/" className={styles["navbar__logo"]}>
            <Logo />
          </Link>
        ) : (
          <Link
            to={user ? PATHS.private.settings.profile : PATHS.signIn}
            className={styles["navbar__user"]}
          >
            <FaCircleUser
              color="white"
              className={styles["navbar__user-profile-icon"]}
            />
            {authedUser}
          </Link>
        )}

        <nav className={styles["navbar__nested-nav"]}>
          <button onClick={toggleMenu} className={styles["navbar__btn"]}>
            {isPopupMenuOpen ? (
              <IoClose
                color={isDarkState ? "var(--color_charcoal-100)" : "white"}
                className={styles["navbar__menu-icon"]}
              />
            ) : (
              <RxHamburgerMenu
                color={isDarkState ? "var(--color_charcoal-100)" : "white"}
                className={styles["navbar__menu-icon"]}
              />
            )}
          </button>
        </nav>

        <Popup isOpen={isPopupMenuOpen} className={styles["navbar__popup"]}>
          {user ? (
            <Menu user={user} className={styles["navbar__menu"]} />
          ) : (
            <AuthToggle />
          )}
        </Popup>
      </div>
    </nav>
  );
}

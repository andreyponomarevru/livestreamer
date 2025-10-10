import React from "react";
import { Link, useLocation } from "react-router";

import { FaCircleUser, RxHamburgerMenu, IoClose } from "../../../ui/icons";
import { Menu } from "./menu/menu-component";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../auth";
import { Logo } from "../logo";

import styles from "./navbar.module.css";
import { PATHS } from "../../../../config/constants";

const displayWhiteLocations = [
  "/",
  PATHS.private.settings.profile,
  PATHS.private.settings.account,
  PATHS.private.settings.notifications,
  PATHS.private.adminDashboard,
  PATHS.private.streams,
];

export function Navbar(): React.ReactElement {
  const location = useLocation();
  const user = useAppSelector(selectCurrentUserProfile);

  const [isOpen, setIsOpen] = React.useState(false);
  function toggleMenu() {
    setIsOpen((isOpen) => !isOpen);
  }

  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const authedUser = "Chillout Aggregator";

  const isDarkState =
    displayWhiteLocations.some((path) => path === location.pathname) || isOpen;

  return (
    <nav
      className={`${styles["navbar"]} ${isDarkState ? styles["navbar_light"] : styles["navbar_dark"]}`}
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
            {isOpen ? (
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

        <Menu isOpen={isOpen} />
      </div>
    </nav>
  );
}

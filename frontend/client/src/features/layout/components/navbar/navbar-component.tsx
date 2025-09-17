import React from "react";
import { Link, useLocation } from "react-router-dom";

import { FaCircleUser, RxHamburgerMenu, RxCross1 } from "../../../ui/icons";
import { Menu } from "./menu/menu-component";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../current-user";
import { Logo } from "../logo";

import styles from "./navbar.module.css";

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

  const isDarkState = location.pathname === "/" || isOpen;

  return (
    <nav
      className={`${styles.navbar} ${isDarkState ? styles.navbar_light : styles.navbar_dark}`}
    >
      {isDarkState ? (
        <Link to="/" className={styles.navbar__logo}>
          <Logo />
        </Link>
      ) : (
        <Link
          to={user ? "/account" : "/signin"}
          className={styles.navbar__user}
        >
          <FaCircleUser
            color="white"
            className={styles["navbar__user-profile-icon"]}
          />
          {authedUser}
        </Link>
      )}

      <button onClick={toggleMenu} className={styles.navbar__btn}>
        {isOpen ? (
          <RxCross1
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

      <Menu isOpen={isOpen} />
    </nav>
  );
}

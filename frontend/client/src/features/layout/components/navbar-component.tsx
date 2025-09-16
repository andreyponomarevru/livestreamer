import React from "react";
import { Link, useLocation } from "react-router-dom";

import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { FaCircleUser } from "react-icons/fa6";

import { Menu } from "./menu-component";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../current-user";
import { Logo } from "./logo";

import styles from "./navbar.module.css";

interface Props extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function Navbar(props: Props): React.ReactElement {
  const location = useLocation();
  const user = useAppSelector(selectCurrentUserProfile);

  const [isOpen, setIsOpen] = React.useState(false);
  function toggleMenu() {
    setIsOpen((isOpen) => !isOpen);
  }

  React.useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={styles.navbar}>
      {location.pathname === "/" && isOpen ? (
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
          Chillout Aggregator
        </Link>
      )}

      <button onClick={toggleMenu} className={styles.navbar__btn}>
        {isOpen ? (
          <RxCross1 color="white" className={styles["navbar__menu-icon"]} />
        ) : (
          <RxHamburgerMenu
            color="white"
            className={styles["navbar__menu-icon"]}
          />
        )}
      </button>

      <Menu isOpen={isOpen} />
    </nav>
  );
}

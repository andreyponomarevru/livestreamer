import React from "react";
import { useLocation, useParams } from "react-router";

import { RxHamburgerMenu, IoClose } from "../../../ui/icons";
import { Menu } from "./menu-component";
import { AuthToggle } from "../../../auth";
import { PATHS } from "../../../../config/constants";
import { Popup } from "../../../ui/popup/popup-component";
import { useGetMeQuery } from "../../../auth";
import { Avatar, Loader } from "../../../ui";
import { API_ROOT_URL } from "../../../../config/env";
import { useGetUserProfileQuery } from "../../../public-profile";
import { Logo } from "./logo-component";

import styles from "./navbar.module.css";

const displayWhiteLocations = [
  "/",
  PATHS.protected.mySettingsIndex,
  PATHS.protected.myAccountSettings,
  PATHS.protected.adminDashboard,
];

export function Navbar(
  props: React.HTMLAttributes<HTMLElement>,
): React.ReactElement {
  const { pathname } = useLocation();
  const isMeRoute = pathname.startsWith("/me");

  const { username: usernameFromParams } = useParams();

  const { data: user } = useGetUserProfileQuery(
    { username: usernameFromParams! },
    { skip: isMeRoute },
  );

  const { data: me, isLoading: isMeLoading } = useGetMeQuery();

  // Popup

  const [isPopupMenuOpen, setIsPopupMenuOpen] = React.useState(false);
  function toggleMenu() {
    setIsPopupMenuOpen((isOpen) => !isOpen);
    console.log("isPopupMenuOpen: ", isPopupMenuOpen);
  }
  React.useEffect(() => {
    setIsPopupMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`${styles["navbar"]} ${styles["navbar_dark"]} ${props.className || ""}`}
    >
      <div className={styles["navbar__wrapper"]}>
        {!user?.displayName && !me?.displayName ? (
          <Logo className={styles["navbar__logo"]} />
        ) : (
          <div className={styles["navbar__user"]}>
            <Avatar
              apiRootUrl={API_ROOT_URL}
              imgUrl={me?.profilePictureUrl || user?.profilePictureUrl}
              className={styles["navbar__avatar"]}
            />
            {user?.displayName || me?.displayName}
          </div>
        )}

        <button onClick={toggleMenu} className={styles["navbar__btn"]}>
          {isPopupMenuOpen ? (
            <IoClose color="white" className={styles["navbar__menu-icon"]} />
          ) : (
            <RxHamburgerMenu
              color="white"
              className={styles["navbar__menu-icon"]}
            />
          )}
        </button>

        <Popup
          isOpen={isPopupMenuOpen}
          className={`${styles["navbar__popup"]} ${me ? "" : styles["navbar__auth-box"]}`}
        >
          {isMeLoading && <Loader />}
          {me ? (
            <Menu user={me} className={styles["navbar__menu"]} />
          ) : (
            <AuthToggle />
          )}
        </Popup>
      </div>
    </nav>
  );
}

import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Icon } from "../../ui/icon/icon";
import { Menu } from "./menu-component";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../current-user";

import "./nav-bar.scss";

interface Props extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export function NavBar(props: Props): React.ReactElement {
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
    <nav className="nav-bar header">
      <button onClick={toggleMenu} className="nav-bar__btn">
        {isOpen ? (
          <Icon name="close" color="white" className="nav-bar__menu-icon" />
        ) : (
          <Icon name="hamburger" color="white" className="nav-bar__menu-icon" />
        )}
      </button>

      <Link to="/" className="nav-bar__link nav-bar__logo">
        LiveStreamer
      </Link>

      <Link to={user ? "/account" : "/signin"}>
        <Icon
          name="user-in-circle"
          color="white"
          className="nav-bar__user-profile-icon"
        />
      </Link>

      <Menu isOpen={isOpen} />
    </nav>
  );
}

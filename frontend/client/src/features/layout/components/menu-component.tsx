import React from "react";
import { NavLink } from "react-router-dom";

import { Icon } from "../../ui/icon/icon";
import { hasPermission } from "../../../utils";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import {
  selectCurrentUserProfile,
  useSignOutMutation,
} from "../../current-user";

import "./menu.scss";

interface Props {
  isOpen: boolean;
}

export function Menu(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const [signOut] = useSignOutMutation();

  async function handleSignOut() {
    try {
      await signOut().unwrap();
    } catch (err) {
      console.error(err);
    }
  }

  const menu = [
    {
      to: "/archive",
      iconName: "archive",
      text: "Archive",
      hasPermission: true,
    },
    {
      to: "/events",
      iconName: "calendar",
      text: "Events",
      hasPermission: true,
    },
    {
      to: "/users",
      iconName: "users",
      text: "Users",
      hasPermission: hasPermission(
        { resource: "all_user_accounts", action: "read" },
        user,
      ),
    },
    {
      to: "/drafts",
      iconName: "pencil",
      text: "Drafts",
      hasPermission: hasPermission(
        { resource: "broadcast_draft", action: "read" },
        user,
      ),
    },
    {
      to: "/signin",
      iconName: "logout",
      text: "Sign Out",
      hasPermission: !!user,
      onClick: handleSignOut,
    },
    { to: "/signin", iconName: "user", text: "Sign In", hasPermission: !user },
  ];

  return (
    <ul className={`menu ${props.isOpen ? "menu_open" : ""}`}>
      {...menu.map((item) => {
        return item.hasPermission ? (
          <li>
            <NavLink
              className="menu__link"
              end
              to={item.to}
              onClick={item.onClick ? item.onClick : undefined}
            >
              <Icon name={item.iconName} />
              {item.text}
            </NavLink>
          </li>
        ) : null;
      })}
    </ul>
  );
}

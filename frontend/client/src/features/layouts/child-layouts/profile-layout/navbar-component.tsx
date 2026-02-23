import { NavLink, useParams, useLocation } from "react-router";

import {
  ImHeadphones,
  FaCircleInfo,
  FaStream,
  FaClock,
} from "../../../ui/icons";
import { PATHS } from "../../../../config/constants";
import { generatePath } from "../../../../utils";

import styles from "./navbar.module.css";

export function Navbar(props: React.HTMLAttributes<HTMLDivElement>) {
  const { pathname } = useLocation();
  const isMeRoute = pathname.startsWith("/me");

  const { username } = useParams();

  const menu = [
    {
      to: isMeRoute
        ? PATHS.protected.listen
        : generatePath(PATHS.public.listen, {
            username,
          }),
      text: "Listen",
      icon: <ImHeadphones />,
    },
    {
      to: isMeRoute
        ? PATHS.protected.scheduledStreams
        : generatePath(PATHS.public.scheduledStreams, { username }),
      text: "Scheduled",
      icon: <FaClock />,
    },
    {
      to: isMeRoute
        ? PATHS.protected.archivedStreams
        : generatePath(PATHS.public.archivedStreams, { username }),
      text: "Archived",
      icon: <FaStream />,
    },
    {
      to: isMeRoute
        ? PATHS.protected.about
        : generatePath(PATHS.public.about, { username }),
      text: "About",
      icon: <FaCircleInfo />,
    },
  ];

  return (
    <nav className={`${styles["navbar"]} ${props.className || ""}`}>
      {...menu.map(({ to, text, icon }) => {
        return (
          <NavLink
            end
            to={to}
            className={({ isActive }) =>
              isActive
                ? `${styles["navbar__link"]} ${styles["navbar__link_active"]}`
                : styles["navbar__link"]
            }
          >
            {icon} {text}
          </NavLink>
        );
      })}
    </nav>
  );
}

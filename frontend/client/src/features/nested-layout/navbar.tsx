import { NavLink } from "react-router";

import { ImHeadphones, FaCircleInfo, FaStream } from "../ui/icons";
import { PATHS } from "../../config/constants";

import styles from "./navbar.module.css";

const menu = [
  { to: PATHS.public.listen, text: "Listen", icon: <ImHeadphones /> },
  { to: PATHS.public.streams, text: "Streams", icon: <FaStream /> },
  { to: PATHS.public.about, text: "About", icon: <FaCircleInfo /> },
];

export function Navbar(props: React.HTMLAttributes<HTMLDivElement>) {
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

import { NavLink } from "react-router-dom";

import { ImHeadphones, FaCircleInfo, FaStream } from "../../ui/icons";

import styles from "./navbar.module.css";

const menu = [
  { to: "/listen", text: "Listen", icon: <ImHeadphones /> },
  { to: "/streams", text: "Streams", icon: <FaStream /> },
  { to: "/about", text: "About", icon: <FaCircleInfo /> },
];

export function Navbar() {
  return (
    <ul className={styles.navbar}>
      {...menu.map(({ to, text, icon }) => {
        return (
          <li className={styles.navbar__item}>
            <NavLink end to={to}>
              {icon} {text}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

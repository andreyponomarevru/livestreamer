import { FiGlobe } from "../../features/ui/icons";

import styles from "./about.module.css";

export function About(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  const meta = {
    url: "http://www.kool97fm.com",
    about: "Souls, Funk, Disco and Reggae music ALL DAY EVERYDAY.",
  };

  return (
    <div className={`${styles["about"]} ${props.className || ""}`}>
      <h4>About</h4>
      <div className={styles["about__links"]}>
        <FiGlobe
          color="var(--color_charcoal-100)"
          className={styles["about__icon"]}
        />
        <a className="link" href={meta.url}>
          {meta.url}
        </a>
      </div>
      <div>{meta.about}</div>
    </div>
  );
}

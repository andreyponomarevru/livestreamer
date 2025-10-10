import styles from "./btn.module.css";

import { type CommonProps } from "./common-props";

interface Props extends CommonProps, React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export function LinkBtn(props: Props) {
  const themeClass = styles[`btn_theme_${props.theme || "primary"}`];
  const disabledClass = props.isLoading
    ? styles[`btn_theme_${props.theme || "primary"}_disabled`]
    : "";

  const className = `${styles["btn"]} ${themeClass} ${disabledClass} ${props.className || ""}`;

  return (
    <a href={props.href || "#"} className={className}>
      {props.children}
    </a>
  );
}

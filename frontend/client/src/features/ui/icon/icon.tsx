import React from "react";

import icons from "../../../assets/icons.svg";

import "./icon.scss";

interface Props extends React.HTMLAttributes<SVGAElement> {
  name: string;
  color?: "black" | "white" | "grey";
}

export function Icon(props: Props): React.ReactElement {
  const { className = "", color = "white" } = props;

  const colorClassName = `icon_fill_${color}`;

  return (
    <svg className={`icon ${colorClassName} ${className}`}>
      <use href={`${icons}#${props.name}`} />
    </svg>
  );
}

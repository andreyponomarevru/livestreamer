import React from "react";

import { Icon } from "../../../features/ui/icon/icon";

import "./icon-btn.scss";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  iconName: string;
  handleBtnClick: () => void;
}

export function IconBtn(props: Props): React.ReactElement {
  const { className = "", iconName } = props;

  return (
    <button
      className={`icon-btn ${className}`}
      onClick={() => props.handleBtnClick()}
    >
      <Icon className="icon-btn__icon default-icon" name={iconName} />
    </button>
  );
}

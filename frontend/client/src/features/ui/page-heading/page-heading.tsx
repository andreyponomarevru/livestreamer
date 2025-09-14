import React from "react";

import "./page-heading.scss";
import { Icon } from "../../../features/ui/icon/icon";

interface Props {
  iconName: string;
  name: string;
}

export function PageHeading(props: Props): React.ReactElement {
  return (
    <div className="page-heading">
      <Icon className="page-heading__icon default-icon" name={props.iconName} />
      <h2 className="page-heading__heading">{props.name}</h2>
    </div>
  );
}

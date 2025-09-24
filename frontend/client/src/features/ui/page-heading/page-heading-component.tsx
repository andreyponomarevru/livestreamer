import React from "react";

import styles from "./page-heading.module.css";

interface Props {
  iconName: string;
  name: string;
}

export function PageHeading(props: Props): React.ReactElement {
  return (
    <div className={styles["page-heading"]}>
      <h2 className={styles["page-heading__heading"]}>{props.name}</h2>
    </div>
  );
}

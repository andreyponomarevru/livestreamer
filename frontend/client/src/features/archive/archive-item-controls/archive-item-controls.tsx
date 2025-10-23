import React from "react";

import { Btn } from "../../../features/ui/btn";
import { Loader } from "../../ui/loader/loader-component";

import styles from "./archive-item-controls.module.css";

export function ArchiveItemControls(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  // TODO: send request to API and change the hardcoded 'isLoaded' value on buttons
  const apiResponse = { broadcast: { isVisible: true } };

  return (
    <div className={styles["archive-item-controls"]}>
      <div></div>
      <Btn theme="primary" isLoading={false}>
        {apiResponse.broadcast.isVisible
          ? "Publish Broadcast"
          : "Hide broadcast"}
        <Loader />
      </Btn>

      <Btn theme="primary" isLoading={false}>
        Delete Broadcast
        <Loader />
      </Btn>
    </div>
  );
}

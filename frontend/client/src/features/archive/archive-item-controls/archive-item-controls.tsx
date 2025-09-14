import React from "react";

import { PlayerLinkForm } from "../../../features/ui/player-link-form/player-link-form";
import { TracklistForm } from "../../../features/ui/tracklist-form/tracklist-form";
import { Btn } from "../../../features/ui/btn";
import { Loader } from "../../../features/ui/loader/loader";

import "../../../features/ui/btn/btn.scss";
import "./archive-item-controls.scss";
import "../../../features/ui/text-input/text-input.scss";

function ArchiveItemControls(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  // TODO: send request to API and change the hardcoded 'isLoaded' value on buttons
  const apiResponse = { broadcast: { isVisible: true } };

  return (
    <div className="archive-item-controls">
      <div></div>
      <Btn
        theme="white"
        isLoading={false}
        name={
          apiResponse.broadcast.isVisible
            ? "Publish Broadcast"
            : "Hide broadcast"
        }
      >
        <Loader for="btn" color="black" />
      </Btn>

      <TracklistForm />
      <PlayerLinkForm />
      <Btn theme="white" name="Delete Broadcast" isLoading={false}>
        <Loader color="black" for="btn" />
      </Btn>
    </div>
  );
}

export { ArchiveItemControls };

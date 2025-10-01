import * as React from "react";

import { ArchiveItem } from "../../features/archive/archive-item/archive-item";
import { type APIResponseSuccess, type Broadcast } from "../../types";
import { useFetch } from "../../hooks/use-fetch";
import { API_ROOT_URL } from "../../config/env";
import { Loader } from "../../features/ui/loader/loader-component";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Message } from "../../features/ui/message/message-component";

import styles from "./archive-page.module.css";

export function ArchivePage(): React.ReactElement {
  const isMounted = useIsMounted();

  const { state: broadcasts, fetchNow: sendGetBroadcastsRequest } =
    useFetch<APIResponseSuccess<Broadcast[]>>();

  React.useEffect(() => {
    if (isMounted) {
      sendGetBroadcastsRequest(`${API_ROOT_URL}/broadcasts`);
    }
  }, [isMounted]);

  // TODO: Add 'Edit broadcast' feature
  function updateBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/${id}`; // PATCH
  }

  // TODO: Add 'Delete broadcast' feature
  function destroyBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/${id}`; // DELETE
  }

  //

  return (
    <div className={`${styles["archive-page"]} ${styles["archive-page_list"]}`}>
      <h4>Archive</h4>

      {broadcasts.isLoading && <Loader />}

      {broadcasts.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {broadcasts.response?.body && (
        <ul className="items-list">
          {broadcasts.response.body.results.map((broadcast) => {
            return (
              <ArchiveItem
                key={broadcast.id}
                title={broadcast.title}
                likeCount={broadcast.likeCount}
                listenerPeakCount={broadcast.listenerPeakCount}
                date={new Date(broadcast.startAt).toLocaleDateString()}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

import * as React from "react";

import { ScheduleForm } from "../../features/event-scheduling/event-form/schedule-form-component";
import { API_ROOT_URL } from "../../config/env";
import {
  type APIResponseSuccess,
  type ScheduledBroadcast as TScheduledBroadcast,
} from "../../types";
import { Loader } from "../../features/ui/loader/loader-component";
import { Message } from "../../features/ui/message/message-component";
import { ScheduledEvent } from "../../features/event-scheduling/scheduled-event/scheduled-event-component";
import { hasPermission } from "../../utils";
import { useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../features/current-user";
import { useFetch } from "../../hooks/use-fetch";
import { useIsMounted } from "../../hooks/use-is-mounted";

import styles from "./events-page.module.css";

export function SchedulePage(): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const { state: broadcasts, fetchNow: sendBroadcastsRequest } =
    useFetch<APIResponseSuccess<TScheduledBroadcast[]>>();

  const isMounted = useIsMounted();
  React.useEffect(() => {
    if (isMounted) {
      sendBroadcastsRequest(`${API_ROOT_URL}/schedule`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted]);

  //

  // TODO: implement "Schedule broadcast" feature
  function scheduleBroadcast({
    title,
    startAt,
    endAt,
  }: {
    title: string;
    startAt: string;
    endAt: string;
  }) {
    const URL = `${API_ROOT_URL}/schedule`; // POST
  }

  // TODO: implement "Delete scheduled broadcast" feature
  function destroyScheduledBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/schedule/${id}`; // DELETE
  }

  //

  return (
    <div className={styles["events-page"]}>
      <h4>Schedule</h4>

      <div className={styles["events-page__timezone"]}>Moscow Time (GMT+3)</div>

      {hasPermission(
        { resource: "scheduled_broadcast", action: "create" },
        user,
      ) && <ScheduleForm />}

      {broadcasts.isLoading && <Loader />}

      {broadcasts.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {broadcasts.response?.body && (
        <ul className="items-list">
          {broadcasts.response.body.results.map((broadcast) => {
            return (
              <ScheduledEvent
                key={broadcast.id}
                title={broadcast.title}
                startAt={new Date(broadcast.startAt).toLocaleString()}
                endAt={new Date(broadcast.endAt).toLocaleString()}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}

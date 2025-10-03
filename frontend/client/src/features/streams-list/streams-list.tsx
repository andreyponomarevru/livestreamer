import * as React from "react";
import { type BroadcastDraft } from "../../types";
import { API_ROOT_URL } from "../../config/env";
import { Calendar, DjIcon } from "../../features/ui/icons";
import { Loader } from "../../features/ui/loader/loader-component";
import { Message } from "../../features/ui/message/message-component";
import { Btn, LinkBtn } from "../../features/ui/btn";
import { PATHS } from "../../config/constants";
import { StreamCard } from "./stream-card";
import { CreateStreamForm } from "./create-stream-form";
import { ShareStreamModal } from "./share-stream-modal";
import { hasPermission } from "../../utils";
import { Warning } from "./warning";

import styles from "./streams-list.module.css";

function useQuery(arg: any) {}

// ex-Drafts page

export function StreamsList(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  const user = { username: undefined };

  const drafts = useQuery({
    queryKey: ["drafts"],
    queryFn: async () => {
      const response = await fetch(`${API_ROOT_URL}/broadcasts/drafts`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        credentials: "include",
      });
      return response.json() as Promise<{ results: BroadcastDraft[] }>;
    },
  });

  //  TODO: Add new features using these endpoints
  function getAllBroadcastDrafts() {
    const URL = `${API_ROOT_URL}/broadcasts/drafts`; // GET
  }
  function updateBroadcastDraft(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/drafts/${id}`; // PATCH
  }
  function destroyBroadcastDraft(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/drafts/${id}`; // DELETE
  }

  //

  return (
    <>
      <div
        className={`${styles["streams-list__header-box"]} ${props.className || ""}`}
      >
        <header className={styles["streams-list__header"]}>
          {/* TODO: get username from path */}
          <h4>
            {user?.username === PATHS.public.streams ? "My Streams" : "Streams"}
          </h4>
          <div>
            <span className={styles["streams-list__counter"]}>3</span>
          </div>
        </header>
        {hasPermission(
          { resource: "scheduled_broadcast", action: "create" },
          user as any,
        ) && (
          <LinkBtn theme="quaternary" href={PATHS.signIn}>
            <DjIcon className={styles["landing-page__dj-icon"]} />
            Start live stream
          </LinkBtn>
        )}
      </div>

      <Warning />

      <header
        className={`${styles["streams-list__header"]} ${styles["streams-list__header_padded"]}`}
      >
        <h5>Scheduled</h5>
      </header>

      <StreamCard meta={{ date: Date.now() + 100000000000000 }} />
      <StreamCard meta={{ date: Date.now() + 100000000000000 }} />

      <hr className={`${styles["streams-list__hr"]} hr`} />

      <header
        className={`${styles["streams-list__header"]} ${styles["streams-list__header_padded"]}`}
      >
        <h5>Archived</h5>
      </header>

      <StreamCard meta={{ date: Date.now() - 100000 }} />
      <StreamCard meta={{ date: Date.now() - 100000 }} />

      {/* TODO: if there are no streams */}
      <EmptyList />

      <ShareStreamModal url="https://koolfmlive.mixlr.com/events/4556191" />

      {/*drafts.isLoading && <Loader />*/}
      {/*drafts.isError && (
        <Message type="danger">Something went wrong :(</Message>
      )*/}
      {/*drafts && (
        <ul className="items-list">
          {drafts.data?.results.map((broadcast) => {
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
      )*/}

      <CreateStreamForm />
    </>
  );
}

function EmptyList() {
  const user = true;

  const canCreate = hasPermission(
    { resource: "scheduled_broadcast", action: "create" },
    user as any,
  );

  return (
    <div className={styles["streams-list__empty-list"]}>
      <Calendar className={styles["streams-list__empty-icon"]} />

      {canCreate ? (
        <>
          <p>No streams scheduled</p>
          <LinkBtn theme="quaternary" href={PATHS.signIn}>
            <DjIcon className={styles["landing-page__dj-icon"]} />
            Start live stream
          </LinkBtn>
        </>
      ) : (
        <p>Chilllout Aggregator does not have any streams yet</p>
      )}
    </div>
  );
}

/* Public view + :

import * as React from "react";

import { ArchiveItem } from "../../features/archive/archive-item/archive-item";
import { type APIResponseSuccess, type Broadcast } from "../../types";
import { useFetch } from "../../hooks/use-fetch";
import { API_ROOT_URL } from "../../config/env";
import { Loader } from "../../features/ui/loader/loader-component";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Message } from "../../features/ui/message/message-component";
import { useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../features/current-user_private";
import { type ScheduledBroadcast as TScheduledBroadcast } from "../../types";
import { hasPermission } from "../../utils";

import styles from "./streams-page.module.css";

export function StreamsPage(): React.ReactElement {
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
  // Scheduled shows page
  //

  const user = useAppSelector(selectCurrentUserProfile);
  const { state: scheduledBroadcasts, fetchNow: sendBroadcastsRequest } =
    useFetch<APIResponseSuccess<TScheduledBroadcast[]>>();

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
    <main
      className={`${styles["streams-page"]} ${styles["streams-page_list"]} page`}
    >
      <div className={`page__box ${styles["streams-page__box"]}`}>
        <h4>Streams</h4>

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

        {// ----------------- scheduled shows: 
        }

        <div className={styles["events-page"]}>
          {
            hasPermission(
              { resource: "scheduled_broadcast", action: "create" },
              user,
            ) && <ScheduleForm />
          }

          {scheduledBroadcasts.isLoading && <Loader />}

          {scheduledBroadcasts.error && (
            <Message type="danger">Something went wrong :(</Message>
          )}

          {scheduledBroadcasts.response?.body && (
            <ul className="items-list">
              {scheduledBroadcasts.response.body.results.map((broadcast) => {
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
      </div>
    </main>
  );
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  startAt: string;
  endAt: string;
}

export function ScheduledEvent(props: Props): React.ReactElement {
  return (
    <li className={`${styles["scheduled-event"]} ${props.className || ""}`}>
      <span className={styles["scheduled-event__start"]}>{props.startAt}</span>
      <span>—</span>
      <span className={styles["scheduled-event__end"]}>{props.endAt}</span>
    </li>
  );
}

*/

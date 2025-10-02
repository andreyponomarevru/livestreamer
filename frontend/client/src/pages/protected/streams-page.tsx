import * as React from "react";
import { type BroadcastDraft } from "../../types";
import { API_ROOT_URL } from "../../config/env";
import { Calendar, DjIcon } from "../../features/ui/icons";
import { Loader } from "../../features/ui/loader/loader-component";
import { Message } from "../../features/ui/message/message-component";
import { Btn, LinkBtn } from "../../features/ui/btn";
import { PATHS } from "../../config/constants";
import { StreamCard } from "../../features/current-user_private/streams";
import { CreateStreamForm } from "../../features/current-user_private/streams/create-stream-form";
import { ShareStreamModal } from "../../features/current-user_private/streams";
import { hasPermission } from "../../utils";
import { Warning } from "../../features/current-user_private/streams";

import styles from "./streams-page.module.css";

function useQuery(arg: any) {}

// ex-Drafts page

export function DraftsPage(
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
    <main className={`${styles["streams-page"]} page`}>
      <div className="page-box page-box_streams">
        <div className={styles["streams-page__header-box"]}>
          <header className={styles["streams-page__header"]}>
            {/* TODO: get username from path */}
            <h4>
              {user?.username === PATHS.public.streams
                ? "My Streams"
                : "Streams"}
            </h4>
            <div>
              <span className={styles["streams-page__counter"]}>3</span>
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
          className={`${styles["streams-page__header"]} ${styles["stream-page__header_padded"]}`}
        >
          <h5>Scheduled</h5>
        </header>

        <StreamCard meta={{ date: Date.now() + 100000000000000 }} />
        <StreamCard meta={{ date: Date.now() + 100000000000000 }} />

        <hr className={`${styles["streams-page__hr"]} hr`} />

        <header
          className={`${styles["streams-page__header"]} ${styles["stream-page__header_padded"]}`}
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
      </div>

      <CreateStreamForm />
    </main>
  );
}

function EmptyList() {
  const user = true;

  const canCreate = hasPermission(
    { resource: "scheduled_broadcast", action: "create" },
    user as any,
  );

  return (
    <div className={styles["streams-page__empty-list"]}>
      <Calendar className={styles["streams-page__empty-icon"]} />

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

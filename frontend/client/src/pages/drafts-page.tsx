import * as React from "react";
import { ArchiveItem } from "../features/archive/archive-item/archive-item";
import { PageHeading } from "../features/ui/page-heading/page-heading";
import { type BroadcastDraft } from "../types";
import { API_ROOT_URL } from "../config/env";
import { Loader } from "../features/ui/loader/loader";
import { Message } from "../features/ui/message/message";

import "../features/ui/items-list/items-list.scss";
import "./drafts-page.scss";

function useQuery(arg: any) {}

function PagesDrafts(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
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
    <div className="drafts-page">
      <PageHeading iconName="archive" name="Drafts" />

      {drafts.isLoading && <Loader for="page" color="pink" />}

      {drafts.isError && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {drafts && (
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
      )}
    </div>
  );
}

export { PagesDrafts };

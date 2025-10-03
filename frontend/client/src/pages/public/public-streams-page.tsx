import * as React from "react";

import { StreamsList } from "../../features/streams-list";

import styles from "./public-streams-page.module.css";

// ex-Drafts page

export function PublicStreamsPage(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  return (
    <main className={`page-box ${styles["public-streams-page"]}`}>
      <div className={`page ${styles["public-streams-page__box"]}`}>
        <StreamsList />
      </div>
    </main>
  );
}

import * as React from "react";

import { StreamsList } from "../../features/streams-list";

// ex-Drafts page

export function StreamsDashboardPage(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  return (
    <main className="page-box">
      <div className="page page_padded-top-and-no-content-padding">
        <StreamsList />
      </div>
    </main>
  );
}

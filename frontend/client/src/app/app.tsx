import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router";

import { ErrorBoundary } from "../features/ui/error-boundary/error-boundary";
import { StreamLikeCountProvider } from "../features/player";
import { ROUTES } from "./routes";

export function App(): React.ReactElement | null {
  const router = createBrowserRouter(ROUTES);

  return (
    <ErrorBoundary>
      <StreamLikeCountProvider>
        <RouterProvider router={router} />
      </StreamLikeCountProvider>
    </ErrorBoundary>
  );
}

import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { ErrorBoundary } from "../features/ui/error-boundary/error-boundary";
import { StreamLikeCountProvider } from "../features/stream/hooks/use-stream-like-count";
import { Layout } from "../features/layout";
import { Page404 } from "../pages/404-page";
import { ROUTES } from "./routes";

export function App(): React.ReactElement | null {
  const router = createBrowserRouter([
    { element: <Layout />, errorElement: <Page404 />, children: ROUTES },
  ]);

  return (
    <ErrorBoundary>
      <StreamLikeCountProvider>
        <RouterProvider router={router} />
      </StreamLikeCountProvider>
    </ErrorBoundary>
  );
}

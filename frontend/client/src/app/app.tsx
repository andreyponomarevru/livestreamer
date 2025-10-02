import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router";

import { ErrorBoundary } from "../features/ui/error-boundary/error-boundary";
import { StreamLikeCountProvider } from "../features/current-user_public/stream";
import { MainLayout } from "../features/layout";
import { Page404 } from "../pages/public/404-page";
import { ROUTES } from "./routes";

export function App(): React.ReactElement | null {
  const router = createBrowserRouter([
    { element: <MainLayout />, errorElement: <Page404 />, children: ROUTES },
  ]);

  return (
    <ErrorBoundary>
      <StreamLikeCountProvider>
        <RouterProvider router={router} />
      </StreamLikeCountProvider>
    </ErrorBoundary>
  );
}

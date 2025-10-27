import { type RouteObject } from "react-router";
import {
  AuthPage,
  ListenPage,
  ForgotPassPage,
  AskToConfirmRegistrationPage,
  ConfirmRegistrationPage,
  PassResetPage,
  UsersPage,
  LandingPage,
  AccountPage,
  ProfilePage,
  AboutPage,
  StreamsDashboardPage,
  StreamsPage,
} from "../pages";
import { ProtectedRoute } from "../features/protected-route/protected-route";
import { PATHS } from "../config/constants";
import { Page404 } from "../pages/public/404-page";
import { ParentLayout, ChildLayout1, ChildLayout2 } from "../features/layouts";

export const ROUTES: RouteObject[] = [
  {
    element: <ParentLayout />,
    errorElement: <Page404 />,
    children: [
      {
        element: <ChildLayout1 />,
        children: [
          { index: true, path: PATHS.root, element: <LandingPage /> },

          {
            path: PATHS.private.streams,
            element: (
              <ProtectedRoute
                requiresPermission={{
                  resource: "broadcast_draft",
                  action: "read",
                }}
              >
                <StreamsDashboardPage />
              </ProtectedRoute>
            ),
          },

          {
            path: PATHS.private.settings.account,
            element: (
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            ),
          },

          {
            path: PATHS.private.settings.profile,
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },

          {
            path: PATHS.private.adminDashboard,
            element: (
              <ProtectedRoute
                requiresPermission={{
                  resource: "all_user_accounts",
                  action: "read",
                }}
              >
                <UsersPage />
              </ProtectedRoute>
            ),
          },

          {
            path: PATHS.confirmationRequired,
            element: <AskToConfirmRegistrationPage />,
          },
          { path: PATHS.passwordReset, element: <PassResetPage /> },
          { path: PATHS.forgotPassword, element: <ForgotPassPage /> },

          {
            path: PATHS.confirmRegistration,
            element: <ConfirmRegistrationPage />,
          },
          { path: PATHS.signIn, element: <AuthPage /> },
          { path: PATHS.register, element: <AuthPage /> },
        ],
      },

      {
        element: <ChildLayout2 />,
        children: [
          { path: PATHS.public.about, element: <AboutPage /> },
          { index: true, path: PATHS.public.streams, element: <StreamsPage /> },
          { path: PATHS.public.listen, element: <ListenPage /> },
        ],
      },
    ],
  },
];

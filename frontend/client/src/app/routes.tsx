import { type RouteObject } from "react-router";
import {
  StreamsPage,
  AuthPage,
  DraftsPage,
  ChatPage,
  ForgotPassPage,
  AskToConfirmRegistrationPage,
  ConfirmRegistrationPage,
  PassResetPage,
  UsersPage,
  LandingPage,
  NotificationsPage,
  AccountPage,
  ProfilePage,
  AboutPage,
} from "../pages";
import { ProtectedRoute } from "../features/protected-route/protected-route";
import { PATHS } from "../config/constants";
import { Page404 } from "../pages/public/404-page";
import { Layout } from "../features/current-user_public/layout/layout";

export const ROUTES: RouteObject[] = [
  { index: true, path: PATHS.root, element: <LandingPage /> },

  {
    element: <Layout />,
    errorElement: <Page404 />,
    children: [
      {
        index: true,
        path: PATHS.public.listen,
        element: <ChatPage />,
      },
      {
        path: PATHS.public.streams,
        element: <StreamsPage />,
      },
      {
        path: PATHS.public.about,
        element: <AboutPage />,
      },
    ],
  },

  {
    path: PATHS.confirmationRequired,
    element: <AskToConfirmRegistrationPage />,
  },
  { path: PATHS.passwordReset, element: <PassResetPage /> },
  { path: PATHS.forgotPassword, element: <ForgotPassPage /> },

  { path: PATHS.confirmRegistration, element: <ConfirmRegistrationPage /> },
  { path: PATHS.signIn, element: <AuthPage /> },
  { path: PATHS.register, element: <AuthPage /> },

  {
    path: PATHS.private.streams,
    element: (
      <ProtectedRoute
        requiresPermission={{
          resource: "broadcast_draft",
          action: "read",
        }}
      >
        <DraftsPage />
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
    path: PATHS.private.settings.notifications,
    element: (
      <ProtectedRoute>
        <NotificationsPage />
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
];

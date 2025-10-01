import {
  ArchivePage,
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
} from "../pages";
import { ProtectedRoute } from "../features/protected-route/protected-route";

export const PATHS = {
  root: "/",

  signIn: "/signin",
  register: "/register",
  confirmationRequired: "/confirmation-required",
  passwordReset: "/password-reset",
  forgotPassword: "/forgot-pass",
  confirmRegistration: "/confirm-registration",

  public: {
    streams: "/username/streams",
    about: "/usernmae/about",
    listen: "/username/listen",
  },

  private: {
    settings: {
      profile: "/settings/profile",
      account: "/settings/account",
      notifications: "/settings/notifications",
    },

    streams: "/streams",

    adminDashboard: "/admin-dashboard",
  },
};

export const ROUTES = [
  { path: PATHS.root, element: <LandingPage /> },

  { path: PATHS.public.listen, element: <ChatPage /> },
  { path: PATHS.public.streams, element: <ArchivePage /> },

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

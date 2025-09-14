import {
  PagesAccount,
  PagesArchive,
  PagesAuth,
  PagesDrafts,
  PagesChat,
  PagesSchedule,
  ForgotPassPage,
  AskToConfirmRegistrationPage,
  ConfirmRegistrationPage,
  PassResetPage,
  PagesUsers,
} from "../pages";
import { ProtectedRoute } from "../features/protected-route/protected-route";

export const PATHS = {
  root: "/",
  confirmationRequired: "/confirmation-required",
  passwordReset: "/password-reset",
  forgotPassword: "/forgot-pass",
  confirmRegistration: "/confirm-registration",
  events: "/events",
  archive: "/archive",
  signIn: "/signin",
  register: "/register",
  drafts: "/drafts",
  account: "/account",
  users: "/users",
};

export const ROUTES = [
  { path: PATHS.root, element: <PagesChat /> },

  {
    path: PATHS.confirmationRequired,
    element: <AskToConfirmRegistrationPage />,
  },

  { path: PATHS.passwordReset, element: <PassResetPage /> },

  { path: PATHS.forgotPassword, element: <ForgotPassPage /> },

  { path: PATHS.confirmRegistration, element: <ConfirmRegistrationPage /> },

  { path: PATHS.events, element: <PagesSchedule /> },

  { path: PATHS.archive, element: <PagesArchive /> },

  { path: PATHS.signIn, element: <PagesAuth /> },

  { path: PATHS.register, element: <PagesAuth /> },

  {
    path: PATHS.drafts,
    element: (
      <ProtectedRoute
        requiresPermission={{
          resource: "broadcast_draft",
          action: "read",
        }}
      >
        <PagesDrafts />
      </ProtectedRoute>
    ),
  },

  {
    path: PATHS.account,
    element: (
      <ProtectedRoute>
        <PagesAccount />
      </ProtectedRoute>
    ),
  },

  {
    path: PATHS.users,
    element: (
      <ProtectedRoute
        requiresPermission={{
          resource: "all_user_accounts",
          action: "read",
        }}
      >
        <PagesUsers />
      </ProtectedRoute>
    ),
  },
];

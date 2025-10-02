export const RESOURCES = [
  "user_own_account",
  "all_user_accounts",
  "user_own_settings",
  "user_own_bookmarks",
  "broadcast",
  "all_broadcasts",
  "broadcast_draft",
  "all_broadcast_drafts",
  "scheduled_broadcast",
  "stream_like",
  "audio_stream",
  "user_own_chat_message",
  "any_chat_message",
] as const;

export const PERMISSIONS = [
  "create",
  "read",
  "update",
  "delete",
  "update_partially",
] as const;

export const PATHS = {
  root: "/",

  signIn: "/signin",
  register: "/register",
  confirmationRequired: "/confirmation-required",
  passwordReset: "/password-reset",
  forgotPassword: "/forgot-pass",
  confirmRegistration: "/confirm-registration",

  public: {
    root: "/username",
    streams: "/username/streams",
    about: "/username/about",
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

export const RESOURCES = [
  "own_user_account",
  "any_user_account",
  "own_broadcast",
  "any_broadcast",
  "stream_like",
  "own_audio_stream",
  "own_chat_message",
  "any_chat_message",
] as const;

export const PERMISSIONS = ["create", "read", "update", "delete"] as const;

export const PATHS = {
  root: "/",

  signIn: "/signin",
  register: "/register",
  confirmationRequired: "/confirmation-required",
  passwordReset: "/password-reset",
  forgotPassword: "/forgot-pass",
  confirmRegistration: "/confirm-registration",

  public: {
    streams: "/:username/streams",
    about: "/:username/about",
    listen: "/:username/broadcasts/:broadcastId",
  },

  private: {
    settings: {
      profile: "/settings/profile",
      account: "/settings/account",
    },

    streams: "/streams",

    adminDashboard: "/admin-dashboard",
  },
};

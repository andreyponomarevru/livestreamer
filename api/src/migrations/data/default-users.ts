export const DEFAULT_USERS = {
  superadminUser: {
    roleName: "superadmin",
    username: process.env.HAL_USERNAME || "",
    password: process.env.HAL_PASSWORD || "",
    email: process.env.HAL_EMAIL || "",
    isEmailConfirmed: true,
    isDeleted: false,
  },
  streamerUser: {
    roleName: "streamer",
    username: process.env.ANDREYPONOMAREV_USERNAME || "",
    password: process.env.ANDREYPONOMAREV_PASSWORD || "",
    email: process.env.ANDREYPONOMAREV_EMAIL || "",
    isEmailConfirmed: true,
    isDeleted: false,
  },
};

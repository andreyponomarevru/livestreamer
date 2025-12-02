import { User } from "./user";
import { SanitizedUser } from "../../types";

export function sanitizeUser(user: User): SanitizedUser {
  return {
    uuid: user.uuid,
    userId: user.userId,
    email: user.email,
    username: user.username,
    permissions: user.permissions,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    isEmailConfirmed: user.isEmailConfirmed,
    displayName: user.displayName,
    websiteUrl: user.websiteUrl,
    about: user.about,
    profilePictureUrl: user.profilePictureUrl,
    subscriptionName: user.subscriptionName,
  };
}

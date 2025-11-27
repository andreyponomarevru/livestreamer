import { User } from "./user";
import { SanitizedUser } from "../../types";

export function sanitizeUser(user: User): SanitizedUser {
  return {
    uuid: user.uuid || "",
    userId: user.userId,
    email: user.email || "",
    username: user.username,
    permissions: user.permissions || {},
  };
}

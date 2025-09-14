import { User } from "./user";
import { SanitizedUser } from "../../types";

export function sanitizeUser(user: User): SanitizedUser {
  return {
    uuid: user.uuid || "",
    id: user.id,
    email: user.email || "",
    username: user.username,
    permissions: user.permissions || {},
  };
}

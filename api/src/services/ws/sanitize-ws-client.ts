import { WSClient, SanitizedWSChatClient } from "../../types";

export function sanitizeWSClient(client: WSClient): SanitizedWSChatClient {
  return {
    uuid: client.uuid,
    username: client.username,
    profilePictureUrl: client.profilePictureUrl,
  };
}

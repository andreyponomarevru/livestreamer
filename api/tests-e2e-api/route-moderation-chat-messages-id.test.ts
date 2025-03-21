import { describe, it } from "@jest/globals";

describe("/moderation/chat/messages/:id", () => {
  describe("DELETE - delete a message", () => {
    describe("204", () => {
      it.todo(
        "responds with an empty body if the message has been deleted successfuly",
      );
    });

    describe("400", () => {
      it.todo(
        "responds with an error if the request parameter doesn't contain the :id",
      );
      it.todo(
        "responds with an error if the request query path doesn't contain the :user_id",
      );
    });

    describe("403", () => {
      it.todo(
        "responds with an error if the user doesn't have the required permissions",
      );
    });
  });
});

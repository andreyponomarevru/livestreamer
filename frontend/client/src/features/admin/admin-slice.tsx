import {
  type User,
  type APIResponseError,
  type APIResponseSuccess,
} from "../../types";
import { apiSplitSlice } from "../api";

//
// Endpoints
//

export const extendedAPISlice = apiSplitSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query() {
        return {
          url: "/admin/users",
          method: "GET",
          credentials: "include",
        };
      },
      transformResponse(rawResult: APIResponseSuccess<User[]>) {
        return rawResult.results;
      },
      transformErrorResponse(rawResult) {
        return rawResult.data as APIResponseError;
      },
    }),

    deleteAnyChatMessage: builder.mutation<
      void,
      { broadcastId: number; messageId: number }
    >({
      query({ broadcastId, messageId }) {
        return {
          url: `/admin/broadcasts/${broadcastId}/messages/${messageId}`,
          method: "DELETE",
          credentials: "include",
        };
      },
    }),
  }),
});

export const { useGetUsersQuery, useDeleteAnyChatMessageMutation } =
  extendedAPISlice;

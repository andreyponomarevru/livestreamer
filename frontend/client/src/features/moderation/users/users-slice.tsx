import {
  type User,
  type APIResponseError,
  type APIResponseSuccess,
} from "../../../types";
import { apiSplitSlice } from "../../api";

//
// Endpoints
//

export const extendedAPISlice = apiSplitSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query() {
        return {
          url: "/users",
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
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
  }),
});

export const { useGetUsersQuery } = extendedAPISlice;

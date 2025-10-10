import * as RTK from "@reduxjs/toolkit";

import { type RootState } from "../../app/store";
import {
  type Credentials,
  type User,
  type APIResponseSuccess,
  type APIResponseError,
} from "../../types";
import { apiSplitSlice } from "../api";

//
// Reducer
//

type State = {
  me: User | null;
  forgotPasswordSubmitted: boolean;
  authenticationStepSubmitted: boolean;
  authenticationStepFailure: boolean;
  authPromptMessage: null | "";
  signupErrors: string[];
  displayCodeResent: false;
};

const initialState: State = {
  me: null,
  forgotPasswordSubmitted: false,
  authenticationStepSubmitted: false,
  authenticationStepFailure: false,
  authPromptMessage: null,
  signupErrors: [],
  displayCodeResent: false,
};

const currentUserSlice = RTK.createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    /*userSet: (state, action) => {
      state = action.payload;
    },*/
    userProfileUpdated: (state, action: RTK.PayloadAction<User>) => {
      state.me = action.payload;
    },
    userProfileCleared: (state) => {
      state.me = null;
    },
  },
});

export const { userProfileUpdated, userProfileCleared } =
  currentUserSlice.actions;

export const currentUserReducer = currentUserSlice.reducer;

//
// Endpoints
//

export const extendedAPIslice = apiSplitSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query() {
        return {
          url: "/user",
          method: "GET",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          credentials: "include",
        };
      },
      async onQueryStarted(queryArgument, queryLifeCycleApi) {
        try {
          const { data: response } = await queryLifeCycleApi.queryFulfilled;
          queryLifeCycleApi.dispatch(userProfileUpdated(response));
        } catch {
          queryLifeCycleApi.dispatch(userProfileCleared());
        }
      },
      transformResponse(rawResult: APIResponseSuccess<User>) {
        return rawResult.results;
      },
      transformErrorResponse(rawResult) {
        return rawResult.data as APIResponseError;
      },
    }),

    signIn: builder.mutation<User, Credentials>({
      query(credentials) {
        return {
          url: "/sessions",
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: credentials,
          credentials: "include",
        };
      },
      async onQueryStarted(queryArgument, queryLifeCycleApi) {
        try {
          const { data: response } = await queryLifeCycleApi.queryFulfilled;
          queryLifeCycleApi.dispatch(userProfileUpdated(response));
        } catch {
          queryLifeCycleApi.dispatch(userProfileCleared());
        }
      },
      transformResponse(rawResult: APIResponseSuccess<User>) {
        return rawResult.results;
      },
      transformErrorResponse(rawResult) {
        return rawResult.data as APIResponseError;
      },
    }),

    signOut: builder.mutation<void, void>({
      query() {
        return {
          url: "/sessions",
          method: "DELETE",
          credentials: "include",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
        };
      },
      async onQueryStarted(queryArgument, queryLifeCycleApi) {
        try {
          await queryLifeCycleApi.queryFulfilled;
          queryLifeCycleApi.dispatch(userProfileCleared());
        } catch {
          console.error("Error during sign out");
        }
      },
    }),

    updatePassword: builder.mutation<
      void,
      { newPassword: string; token: string | null }
    >({
      query({ newPassword, token }) {
        return {
          url: "/user/settings/password",
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          body: { newPassword, token },
          credentials: "include",
        };
      },
    }),
  }),
});

export const {
  useSignInMutation,
  useSignOutMutation,
  useUpdatePasswordMutation,
  useLazyGetCurrentUserQuery,
  useGetCurrentUserQuery,
} = extendedAPIslice;

//
// Selectors
//

function selectCurrentUser(state: RootState) {
  return state.currentUser;
}

export const selectCurrentUserProfile = RTK.createSelector(
  [selectCurrentUser],
  (user) => user.me,
);

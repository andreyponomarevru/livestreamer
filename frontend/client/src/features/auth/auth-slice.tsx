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

const authSlice = RTK.createSlice({
  name: "auth",
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

export const { userProfileUpdated, userProfileCleared } = authSlice.actions;

export const authReducer = authSlice.reducer;

//
// Endpoints
//

export const extendedAPIslice = apiSplitSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<
      void,
      { email: string; username: string; password: string }
    >({
      query({ email, username, password }) {
        return {
          url: "/users",
          method: "POST",
          authorization: `Basic ${btoa(`${username}:${password}`)}`,
          body: { email },
        };
      },
    }),

    signIn: builder.mutation<User, Credentials>({
      query(credentials) {
        return {
          url: "/sessions",
          method: "POST",
          body: credentials,
          credentials: "include",
        };
      },
      async onQueryStarted(queryArgument, queryLifeCycleApi) {
        try {
          const { data } = await queryLifeCycleApi.queryFulfilled;

          queryLifeCycleApi.dispatch(userProfileUpdated(data));
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

    sendConfirmationToken: builder.mutation<void, string>({
      query(token) {
        return {
          url: `/verification?token=${token}`,
          method: "POST",
        };
      },
    }),

    getMe: builder.query<User, void>({
      // The 'User' tag is invalidated by requests in current-user-slice.
      providesTags: ["User"],
      query() {
        return {
          url: "/users/me",
          method: "GET",
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
  }),
});

export const {
  useSignInMutation,
  useSignOutMutation,
  useSendConfirmationTokenMutation,
  useSignUpMutation,
  useGetMeQuery,
} = extendedAPIslice;

//
// Selectors
//

function selectCurrentUser(state: RootState) {
  return state.auth;
}

// TODO: thre is no point in using createSelector (memoized selector) because you're always returning the same object reference

export const selectCurrentUserProfile = RTK.createSelector(
  [selectCurrentUser],
  (user) => user.me,
);
